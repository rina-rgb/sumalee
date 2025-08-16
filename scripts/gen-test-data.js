// scripts/gen-test-data.js
import { writeFileSync } from "fs";
import { faker } from "@faker-js/faker";
import { Command } from "commander";
import { subDays, addDays, format } from "date-fns";

const program = new Command();
program.option(
	"-d, --date <value>",
	"target date (YYYY-MM-DD)",
	format(new Date(), "yyyy-MM-dd")
);
program.parse(process.argv);
const options = program.opts();
const targetDate = new Date(options.date);

function getNextWeekDates(date) {
	// Generate 7 days starting from the target date (today)
	return Array.from({ length: 7 }, (_, i) =>
		format(addDays(date, i), "yyyy-MM-dd")
	);
}

const DATES = getNextWeekDates(targetDate);
const NUM_BOOKINGS_PER_DAY = [7, 15]; // min/max

console.log(
	`Generating bookings for dates: ${JSON.stringify(DATES, null, 2)}\n`
);

// Available services - must match exactly what's in the modal
const AVAILABLE_SERVICES = [
	"Massage Therapy",
	"Acupuncture",
	"Chiropractic Care",
	"Physical Therapy",
];

// 1) Therapists
const therapists = Array.from({ length: 3 }).map(() => ({
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	avatarUrl: faker.image.avatar(),
	color: faker.color.rgb({ format: "css" }),
	specialties: faker.helpers.arrayElements(
		["massage", "pt", "acupuncture", "chiropractic"],
		2
	),
	timeZone: "America/Los_Angeles",
	availability: Array.from({ length: 5 }).flatMap((_, wd) => [
		{ weekday: wd, startHour: 9, endHour: 12 },
		{ weekday: wd, startHour: 13, endHour: 17 },
	]),
	createdAt: faker.date.recent({ days: 30 }).toISOString(),
	updatedAt: faker.date.recent({ days: 5 }).toISOString(),
}));

// 2) Customers
const customers = Array.from({ length: 10 }).map(() => ({
	id: faker.string.uuid(),
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	email: faker.internet.email(),
	phone: faker.phone.number(),
	avatarUrl: faker.image.avatar(),
	createdAt: faker.date.recent({ days: 30 }).toISOString(),
}));

// 3) Bookings across the week
const bookings = [];

// Track occupied time slots per therapist per day to avoid overlaps
const occupiedSlots = {};

// Helper to check if time slots overlap
const timesOverlap = (start1, end1, start2, end2) => {
	const toMinutes = (time) => {
		const [h, m] = time.split(":").map(Number);
		return h * 60 + m;
	};
	const s1 = toMinutes(start1),
		e1 = toMinutes(end1);
	const s2 = toMinutes(start2),
		e2 = toMinutes(end2);
	return s1 < e2 && e1 > s2;
};

// Generate 5-10 bookings per day
DATES.forEach((date) => {
	const bookingsPerDay = faker.number.int({
		min: NUM_BOOKINGS_PER_DAY[0],
		max: NUM_BOOKINGS_PER_DAY[1],
	});
	let attempts = 0;
	let created = 0;

	while (created < bookingsPerDay && attempts < 50) {
		attempts++;

		const therapist = faker.helpers.arrayElement(therapists);
		const customer = faker.helpers.arrayElement(customers);

		// pick a random half-hour slot between 08:00 and 16:30
		const hour = faker.number.int({ min: 8, max: 16 });
		const minute = faker.helpers.arrayElement([0, 30]);

		// build JS Date for start
		const [year, month, day] = date.split("-").map(Number);
		const startDate = new Date(year, month - 1, day, hour, minute, 0, 0);
		const duration = faker.helpers.arrayElement([60, 90]); // Minimum 1 hour (60 minutes)
		const endDate = new Date(startDate.getTime() + duration * 60000);

		// format "HH:mm"
		const pad = (n) => String(n).padStart(2, "0");
		const start = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`;
		const end = `${pad(endDate.getHours())}:${pad(endDate.getMinutes())}`;

		// Check for overlaps
		const slotKey = `${therapist.id}-${date}`;
		if (!occupiedSlots[slotKey]) occupiedSlots[slotKey] = [];

		const hasOverlap = occupiedSlots[slotKey].some((slot) =>
			timesOverlap(start, end, slot.start, slot.end)
		);

		if (!hasOverlap) {
			occupiedSlots[slotKey].push({ start, end });
			created++;

			bookings.push({
				id: faker.string.uuid(),
				therapistId: therapist.id,
				// Embed the full customer object
				customer: {
					id: customer.id,
					firstName: customer.firstName,
					lastName: customer.lastName,
					email: customer.email,
					phone: customer.phone,
				},
				date, // "YYYY-MM-DD"
				start, // "HH:mm"
				end, // "HH:mm"
				service: faker.helpers.arrayElement(AVAILABLE_SERVICES), // Use exact service names
				durationMinutes: duration,
				notes: faker.lorem.sentence(),
			});
		}
	}
});

// Sort bookings by date and time
bookings.sort((a, b) => {
	if (a.date !== b.date) return a.date.localeCompare(b.date);
	return a.start.localeCompare(b.start);
});

// 4) Create regular bookings (with customerId) for backwards compatibility
const regularBookings = bookings.map((b) => ({
	id: b.id,
	therapistId: b.therapistId,
	customerId: b.customer.id, // Extract just the ID
	date: b.date,
	start: b.start,
	end: b.end,
	service: b.service,
	durationMinutes: b.durationMinutes,
	notes: b.notes,
	createdAt: faker.date.recent({ days: 30 }).toISOString(),
}));

// 5) Write out JSON
writeFileSync("public/therapists.json", JSON.stringify(therapists, null, 2));
writeFileSync("public/customers.json", JSON.stringify(customers, null, 2));
writeFileSync("public/bookings.json", JSON.stringify(bookings, null, 2)); // BookingForDay format
writeFileSync(
	"public/bookings-regular.json",
	JSON.stringify(regularBookings, null, 2)
); // Regular Booking format

// Summary
console.log("\n✅ Generated:");
console.log(`   - ${therapists.length} therapists`);
console.log(`   - ${customers.length} customers`);
console.log(
	`   - ${bookings.length} total bookings across ${DATES.length} days`
);
console.log("\n📅 Bookings per day:");
DATES.forEach((date) => {
	const count = bookings.filter((b) => b.date === date).length;
	console.log(`   - ${date}: ${count} bookings`);
});
console.log("\n📄 Files created:");
console.log("   - public/therapists.json");
console.log("   - public/customers.json");
console.log("   - public/bookings.json (BookingForDay format)");
console.log("   - public/bookings-regular.json (Booking format)");
