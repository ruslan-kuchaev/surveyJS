import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const password = "password123";
	const passwordHash = await bcrypt.hash(password, 10);

	await prisma.answer.deleteMany();
	await prisma.response.deleteMany();
	await prisma.option.deleteMany();
	await prisma.question.deleteMany();
	await prisma.survey.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.user.deleteMany();

	const coordinator = await prisma.user.create({
		data: { name: "Coordinator", email: "coordinator@example.com", passwordHash, role: "COORDINATOR" },
	});
	const respondent = await prisma.user.create({
		data: { name: "Respondent", email: "respondent@example.com", passwordHash, role: "RESPONDENT" },
	});

	await prisma.survey.create({
		data: {
			title: "Frontend tooling preferences",
			status: "OPEN",
			createdById: coordinator.id,
			questions: {
				create: [
					{ text: "Favorite frontend framework?", order: 1, options: { create: [ { text: "React", order: 1 }, { text: "Vue", order: 2 }, { text: "Svelte", order: 3 }, { text: "Angular", order: 4 } ] } },
					{ text: "CSS tooling of choice?", order: 2, options: { create: [ { text: "Tailwind CSS", order: 1 }, { text: "CSS Modules", order: 2 }, { text: "Styled Components", order: 3 }, { text: "Vanilla CSS", order: 4 } ] } },
					{ text: "Preferred state management?", order: 3, options: { create: [ { text: "Zustand", order: 1 }, { text: "Redux", order: 2 }, { text: "MobX", order: 3 }, { text: "Context API", order: 4 } ] } },
				],
			},
		},
	});

	console.log("Seeded users:", coordinator.email, respondent.email);
	console.log("Password for both:", password);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
}).finally(async () => {
	await prisma.$disconnect();
});
