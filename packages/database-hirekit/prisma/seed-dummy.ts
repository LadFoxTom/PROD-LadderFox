import { PrismaClient } from '../generated/client';

const db = new PrismaClient();

async function main() {
  // Find the user and their company
  const user = await db.user.findUnique({
    where: { email: 'tmschweig96@outlook.com' },
    include: { ownedCompanies: true },
  });

  if (!user) {
    console.error('User not found: tmschweig96@outlook.com');
    process.exit(1);
  }

  const company = user.ownedCompanies[0];
  if (!company) {
    console.error('No company found for this user');
    process.exit(1);
  }

  console.log(`Found company: ${company.name} (${company.id})`);

  // Create jobs
  const jobs = await Promise.all([
    db.job.create({
      data: {
        companyId: company.id,
        title: 'Senior Frontend Engineer',
        description: 'We are looking for a Senior Frontend Engineer to join our product team. You will be responsible for building and maintaining our web applications using React, TypeScript, and Next.js.\n\nResponsibilities:\n- Architect and implement complex UI features\n- Mentor junior developers and conduct code reviews\n- Collaborate with designers and product managers\n- Improve performance and accessibility\n\nRequirements:\n- 5+ years of experience with React/TypeScript\n- Experience with Next.js and server-side rendering\n- Strong understanding of web performance optimization\n- Excellent communication skills',
        location: 'Berlin',
        type: 'full-time',
        department: 'Engineering',
        salaryMin: 65000,
        salaryMax: 85000,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
    db.job.create({
      data: {
        companyId: company.id,
        title: 'Product Designer',
        description: 'Join our design team to shape the future of our product. You will work closely with engineering and product to create intuitive, beautiful user experiences.\n\nResponsibilities:\n- Design end-to-end user flows and interactions\n- Create high-fidelity prototypes in Figma\n- Conduct user research and usability testing\n- Maintain and evolve the design system\n\nRequirements:\n- 3+ years of product design experience\n- Proficiency in Figma and prototyping tools\n- Portfolio showcasing web/SaaS product work\n- Experience with design systems',
        location: 'Remote',
        type: 'full-time',
        department: 'Design',
        salaryMin: 55000,
        salaryMax: 75000,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
    db.job.create({
      data: {
        companyId: company.id,
        title: 'Backend Engineer',
        description: 'We need a Backend Engineer to help build scalable APIs and services. You will work with Node.js, PostgreSQL, and cloud infrastructure.\n\nResponsibilities:\n- Design and implement RESTful APIs\n- Optimize database queries and schema design\n- Set up monitoring, logging, and alerting\n- Ensure security best practices\n\nRequirements:\n- 3+ years with Node.js/TypeScript\n- Strong SQL and PostgreSQL experience\n- Familiarity with AWS or similar cloud platforms\n- Experience with CI/CD pipelines',
        location: 'Berlin',
        type: 'full-time',
        department: 'Engineering',
        salaryMin: 60000,
        salaryMax: 80000,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
    db.job.create({
      data: {
        companyId: company.id,
        title: 'Marketing Manager',
        description: 'Lead our marketing efforts to grow brand awareness and drive customer acquisition. You will own the full marketing funnel from content to conversion.\n\nResponsibilities:\n- Develop and execute marketing strategies\n- Manage content calendar and social media presence\n- Run paid campaigns (Google Ads, LinkedIn)\n- Analyze metrics and optimize conversion rates\n\nRequirements:\n- 4+ years in B2B SaaS marketing\n- Experience with SEO, content marketing, and paid ads\n- Data-driven mindset with analytics experience\n- Excellent writing and storytelling skills',
        location: 'Munich',
        type: 'full-time',
        department: 'Marketing',
        salaryMin: 50000,
        salaryMax: 70000,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
    db.job.create({
      data: {
        companyId: company.id,
        title: 'DevOps Intern',
        description: 'A great opportunity to learn cloud infrastructure and DevOps practices in a fast-paced startup environment.\n\nWhat you will learn:\n- Container orchestration with Docker and Kubernetes\n- CI/CD pipeline management\n- Infrastructure as Code (Terraform)\n- Monitoring and observability\n\nRequirements:\n- Currently studying Computer Science or related field\n- Basic knowledge of Linux and command line\n- Familiarity with Git\n- Eager to learn and grow',
        location: 'Berlin',
        type: 'internship',
        department: 'Engineering',
        salaryMin: 1200,
        salaryMax: 1800,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
    db.job.create({
      data: {
        companyId: company.id,
        title: 'Freelance Content Writer',
        description: 'We are looking for a freelance content writer to produce high-quality blog posts, case studies, and documentation.\n\nScope:\n- 4-6 articles per month\n- SEO-optimized blog posts (1500-2500 words)\n- Customer case studies and success stories\n- Technical documentation and guides\n\nRequirements:\n- Proven experience writing for SaaS/tech audiences\n- Strong understanding of SEO best practices\n- Ability to explain complex topics simply\n- Native or near-native English',
        location: 'Remote',
        type: 'freelance',
        department: 'Marketing',
        salaryMin: null,
        salaryMax: null,
        salaryCurrency: 'EUR',
        active: true,
      },
    }),
  ]);

  console.log(`Created ${jobs.length} jobs`);

  // Create applicants for the jobs
  const applicants = [
    {
      name: 'Anna Mueller',
      email: 'anna.mueller@example.com',
      phone: '+49 170 1234567',
      jobIndex: 0, // Senior Frontend Engineer
      status: 'screening',
      aiScore: 92,
    },
    {
      name: 'Luca Rossi',
      email: 'luca.rossi@example.com',
      phone: '+39 345 6789012',
      jobIndex: 0,
      status: 'interviewing',
      aiScore: 87,
    },
    {
      name: 'Sofia Andersson',
      email: 'sofia.andersson@example.com',
      phone: '+46 73 1234567',
      jobIndex: 0,
      status: 'new',
      aiScore: 78,
    },
    {
      name: 'Marco Weber',
      email: 'marco.weber@example.com',
      phone: '+49 151 9876543',
      jobIndex: 1, // Product Designer
      status: 'screening',
      aiScore: 85,
    },
    {
      name: 'Emma Dupont',
      email: 'emma.dupont@example.com',
      phone: '+33 6 12345678',
      jobIndex: 1,
      status: 'offered',
      aiScore: 94,
    },
    {
      name: 'Jonas Schmidt',
      email: 'jonas.schmidt@example.com',
      phone: '+49 160 5551234',
      jobIndex: 2, // Backend Engineer
      status: 'new',
      aiScore: 81,
    },
    {
      name: 'Chloe Martin',
      email: 'chloe.martin@example.com',
      phone: '+33 7 98765432',
      jobIndex: 2,
      status: 'screening',
      aiScore: 76,
    },
    {
      name: 'Erik Johansson',
      email: 'erik.johansson@example.com',
      phone: '+46 70 5559876',
      jobIndex: 2,
      status: 'interviewing',
      aiScore: 89,
    },
    {
      name: 'Laura Fischer',
      email: 'laura.fischer@example.com',
      phone: '+49 172 3456789',
      jobIndex: 3, // Marketing Manager
      status: 'new',
      aiScore: 72,
    },
    {
      name: 'Thomas Berger',
      email: 'thomas.berger@example.com',
      phone: '+49 175 6543210',
      jobIndex: 3,
      status: 'hired',
      aiScore: 91,
    },
    {
      name: 'Mia Hoffmann',
      email: 'mia.hoffmann@example.com',
      phone: '+49 163 1112233',
      jobIndex: 4, // DevOps Intern
      status: 'new',
      aiScore: 68,
    },
    {
      name: 'Paul Keller',
      email: 'paul.keller@example.com',
      phone: '+49 176 4445566',
      jobIndex: 4,
      status: 'screening',
      aiScore: 74,
    },
  ];

  const cvTemplate = (name: string, email: string, phone: string) => ({
    personalInfo: {
      firstName: name.split(' ')[0],
      lastName: name.split(' ')[1],
      email,
      phone,
      location: 'Europe',
      summary: `Experienced professional with a strong background in technology and a passion for building great products. Looking for new challenges and opportunities to grow.`,
    },
    experience: [
      {
        company: 'TechCorp GmbH',
        position: 'Software Developer',
        startDate: '2021-03',
        endDate: '2024-12',
        description: 'Worked on building scalable web applications using modern technologies. Collaborated with cross-functional teams to deliver features on time.',
      },
      {
        company: 'StartupXYZ',
        position: 'Junior Developer',
        startDate: '2019-06',
        endDate: '2021-02',
        description: 'Contributed to the development of the company\'s main product. Participated in code reviews and agile ceremonies.',
      },
    ],
    education: [
      {
        institution: 'Technical University',
        degree: 'B.Sc. Computer Science',
        startDate: '2015-09',
        endDate: '2019-05',
        description: 'Graduated with honors. Focused on software engineering and distributed systems.',
      },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Git', 'Docker', 'Agile'],
  });

  const createdApplicants = await Promise.all(
    applicants.map((a) =>
      db.application.create({
        data: {
          companyId: company.id,
          jobId: jobs[a.jobIndex]!.id,
          name: a.name,
          email: a.email,
          phone: a.phone,
          status: a.status,
          aiScore: a.aiScore,
          aiScoreData: {
            overall: a.aiScore,
            skills: Math.min(100, a.aiScore + Math.floor(Math.random() * 10 - 5)),
            experience: Math.min(100, a.aiScore + Math.floor(Math.random() * 10 - 5)),
            education: Math.min(100, a.aiScore + Math.floor(Math.random() * 10 - 5)),
          },
          cvData: cvTemplate(a.name, a.email, a.phone),
        },
      })
    )
  );

  console.log(`Created ${createdApplicants.length} applicants`);
  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
