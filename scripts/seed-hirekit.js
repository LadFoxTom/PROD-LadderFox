const bcrypt = require('../node_modules/.pnpm/bcryptjs@3.0.3/node_modules/bcryptjs');
const { PrismaClient } = require('../packages/database-hirekit/generated/client');
const db = new PrismaClient();

async function seed() {
  const passwordHash = await bcrypt.hash('test1234', 12);

  const user = await db.user.upsert({
    where: { email: 'dev@hirekit.io' },
    update: {},
    create: {
      email: 'dev@hirekit.io',
      name: 'Dev User',
      passwordHash,
      ownedCompanies: {
        create: {
          name: 'Test Company',
          slug: 'test-company',
        },
      },
    },
    include: { ownedCompanies: true },
  });

  const company =
    user.ownedCompanies[0] ||
    (await db.company.findFirst({ where: { ownerId: user.id } }));

  await db.branding.upsert({
    where: { companyId: company.id },
    update: {},
    create: { companyId: company.id, primaryColor: '#4F46E5' },
  });

  await db.cVTemplate.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      templateType: 'classic',
      sections: {
        personalInfo: { enabled: true },
        experience: { enabled: true, min: 1 },
        education: { enabled: true },
        skills: { enabled: true },
      },
    },
  });

  await db.landingPage.upsert({
    where: { companyId: company.id },
    update: {},
    create: {
      companyId: company.id,
      domain: 'test-company.hirekit.io',
      title: 'Apply at Test Company',
      successMessage: 'Thanks! We received your application.',
    },
  });

  await db.application.create({
    data: {
      companyId: company.id,
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+31 6 1234 5678',
      status: 'new',
      cvData: {
        fullName: 'Jane Smith',
        title: 'Senior Frontend Developer',
        contact: { email: 'jane@example.com', phone: '+31 6 1234 5678', location: 'Amsterdam, NL' },
        summary: 'Experienced frontend developer with 6+ years building React applications. Passionate about clean code, performance optimization, and accessible design.',
        experience: [
          { title: 'Senior Frontend Developer', company: 'TechCorp', dates: 'Jan 2022 - Present', achievements: ['Led migration from Vue to React, improving performance by 40%', 'Built design system used by 12 product teams', 'Mentored 4 junior developers'] },
          { title: 'Frontend Developer', company: 'StartupXYZ', dates: 'Mar 2019 - Dec 2021', achievements: ['Built customer dashboard from scratch serving 50k users', 'Implemented real-time collaboration features using WebSockets'] },
        ],
        education: [{ institution: 'University of Amsterdam', degree: 'BSc', field: 'Computer Science', dates: '2015 - 2019' }],
        skills: { technical: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'], soft: ['Leadership', 'Communication'], tools: ['Git', 'Figma', 'Jira'] },
      },
    },
  });

  await db.application.create({
    data: {
      companyId: company.id,
      email: 'mark@example.com',
      name: 'Mark Johnson',
      status: 'new',
      cvData: {
        fullName: 'Mark Johnson',
        title: 'Full Stack Engineer',
        contact: { email: 'mark@example.com', phone: '+31 6 9876 5432', location: 'Rotterdam, NL' },
        summary: 'Full stack engineer focused on building scalable web applications.',
        experience: [{ title: 'Full Stack Engineer', company: 'BigCo', dates: 'Jun 2021 - Present', achievements: ['Designed microservices architecture handling 1M+ requests/day', 'Reduced deployment time by 70% with CI/CD pipeline improvements'] }],
        education: [{ institution: 'TU Delft', degree: 'MSc', field: 'Software Engineering', dates: '2018 - 2020' }],
        skills: { technical: ['Python', 'Go', 'React', 'PostgreSQL', 'Docker', 'AWS'], soft: ['Problem solving'], tools: ['Terraform', 'GitHub Actions'] },
      },
    },
  });

  console.log('Done! Company ID:', company.id);
  console.log('Login: dev@hirekit.io / test1234');
  await db.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
