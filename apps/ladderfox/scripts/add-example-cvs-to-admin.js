/**
 * Add Example CVs to Admin Account
 * 
 * This script adds all 30 example CVs from the CV examples page
 * to the admin@admin.com account.
 * 
 * Run with: node scripts/add-example-cvs-to-admin.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// All profession IDs from exampleCVs.ts
const PROFESSION_IDS = [
  'nurse',
  'software-developer',
  'teacher',
  'accountant',
  'marketing-manager',
  'graphic-designer',
  'administrative-assistant',
  'engineer',
  'sales-representative',
  'chef',
  'lawyer',
  'data-scientist',
  'doctor',
  'pharmacist',
  'it-support',
  'professor',
  'school-counselor',
  'financial-analyst',
  'photographer',
  'copywriter',
  'mechanical-engineer',
  'civil-engineer',
  'account-manager',
  'retail-manager',
  'office-manager',
  'executive-assistant',
  'hotel-manager',
  'restaurant-manager',
  'paralegal',
  'legal-assistant'
];

// Example CV data - copied from exampleCVs.ts
const EXAMPLE_CVS = {
  'nurse': {
    template: 'modern',
    fullName: 'Emma van der Berg',
    title: 'Verpleegkundige',
    summary: 'Ervaren verpleegkundige met 8+ jaar ervaring in acute zorg en patiëntenzorg. Gespecialiseerd in intensive care en spoedeisende hulp. Gepassioneerd over evidence-based zorg en continue professionele ontwikkeling.',
    photoUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
    contact: {
      email: 'emma.vanderberg@email.nl',
      phone: '+31 6 12345678',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Verpleegkundige Intensive Care',
        company: 'Academisch Medisch Centrum',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Verzorging van kritisch zieke patiënten op de IC-afdeling',
          'Beheer van beademingsapparatuur en monitoring systemen',
          'Samenwerking met multidisciplinair team van artsen en specialisten',
          'Begeleiding van nieuwe verpleegkundigen en stagiaires'
        ]
      },
      {
        title: 'Verpleegkundige Spoedeisende Hulp',
        company: 'St. Elisabeth Ziekenhuis',
        location: 'Tilburg',
        dates: '2017 - 2020',
        achievements: [
          'Triage en eerste opvang van spoedpatiënten',
          'Assistentie bij medische procedures en reanimaties',
          'Coördinatie van patiëntenzorg in drukke omgeving',
          'Training in Advanced Life Support (ALS)'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool van Amsterdam',
        degree: 'Bachelor Verpleegkunde',
        field: 'Verpleegkunde',
        dates: '2013 - 2017',
        achievements: [
          'Diploma behaald met onderscheiding',
          'Stage op IC-afdeling en spoedeisende hulp',
          'Scriptie over evidence-based verpleegkundige interventies'
        ]
      }
    ],
    skills: {
      technical: ['EPD systemen', 'Medicatietoediening', 'Wondverzorging', 'Beademingsapparatuur'],
      soft: ['Empathie', 'Communicatie', 'Stressbestendigheid', 'Teamwerk', 'Kritisch denken']
    },
    certifications: [
      { title: 'Advanced Life Support (ALS)', institution: 'Nederlandse Reanimatieraad', year: '2021' },
      { title: 'Intensive Care Verpleegkunde', institution: 'V&VN', year: '2020' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
    hobbies: ['Hardlopen', 'Lezen', 'Vrijwilligerswerk', 'Koken']
  },
  'software-developer': {
    template: 'modern',
    fullName: 'Lucas Jansen',
    title: 'Senior Software Developer',
    summary: 'Ervaren full-stack developer met 10+ jaar ervaring in het bouwen van schaalbare webapplicaties en microservices. Gespecialiseerd in React, Node.js en cloud architecture. Gepassioneerd over clean code en performance optimalisatie.',
    photoUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    contact: {
      email: 'lucas.jansen@email.nl',
      phone: '+31 6 23456789',
      location: 'Utrecht, Nederland',
      linkedin: 'linkedin.com/in/lucasjansen',
      website: 'lucasjansen.dev'
    },
    experience: [
      {
        title: 'Senior Software Developer',
        company: 'TechCorp Nederland',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Leiding aan team van 6 developers voor betalingssysteem met 2M+ gebruikers',
          'Architectuur en implementatie van microservices infrastructuur',
          'Serverkosten met 35% verlaagd door optimalisatie',
          'Mentoring van junior developers'
        ]
      },
      {
        title: 'Full Stack Developer',
        company: 'InnovateSoft',
        location: 'Rotterdam',
        dates: '2017 - 2020',
        achievements: [
          'Ontwikkeling van React en Angular applicaties',
          'Samenwerking met UX designers voor responsive interfaces',
          'Database schema design en optimalisatie',
          'E-commerce platform gebouwd dat conversie met 28% verhoogde'
        ]
      }
    ],
    education: [
      {
        institution: 'Technische Universiteit Delft',
        degree: 'Master Computer Science',
        field: 'Software Engineering',
        dates: '2014 - 2017',
        achievements: ['Cum Laude afgestudeerd', 'Specialisatie in Distributed Systems']
      }
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
      soft: ['Probleemoplossend denken', 'Teamleiderschap', 'Agile/Scrum', 'Code reviews']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Programmeren', 'Gaming', 'Fietsen', 'Open source bijdragen']
  },
  'teacher': {
    template: 'modern',
    fullName: 'Sophie de Vries',
    title: 'Docent Basisonderwijs',
    summary: 'Gepassioneerde basisschooldocent met 7 jaar ervaring in het lesgeven aan kinderen van 6-12 jaar. Gespecialiseerd in differentiatie en inclusief onderwijs. Focus op het creëren van een positieve leeromgeving.',
    photoUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
    contact: {
      email: 'sophie.devries@email.nl',
      phone: '+31 6 34567890',
      location: 'Den Haag, Nederland'
    },
    experience: [
      {
        title: 'Groepsleerkracht Groep 5/6',
        company: 'Basisschool De Regenboog',
        location: 'Den Haag',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Lesgeven aan groep van 25 leerlingen',
          'Ontwikkeling van gepersonaliseerde lesplannen',
          'Samenwerking met ouders en zorgteam',
          'Organisatie van schoolactiviteiten en excursies'
        ]
      },
      {
        title: 'Groepsleerkracht Groep 3',
        company: 'Basisschool Het Palet',
        location: 'Rotterdam',
        dates: '2016 - 2019',
        achievements: [
          'Lesgeven aan beginnende lezers',
          'Implementatie van nieuwe lesmethoden',
          'Begeleiding van stagiaires'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool Rotterdam',
        degree: 'PABO - Bachelor Leraar Basisonderwijs',
        field: 'Onderwijs',
        dates: '2012 - 2016',
        achievements: ['Diploma behaald', 'Stage op verschillende basisscholen']
      }
    ],
    skills: {
      technical: ['Lesmethoden', 'Klassenmanagement', 'ICT in onderwijs', 'Differentiatie'],
      soft: ['Geduld', 'Creativiteit', 'Communicatie', 'Empathie', 'Organisatie']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Lezen', 'Handwerken', 'Wandelen', 'Vrijwilligerswerk']
  },
  'accountant': {
    template: 'modern',
    fullName: 'Daan Bakker',
    title: 'Registeraccountant',
    summary: 'Ervaren accountant met 12+ jaar ervaring in financiële controle, belastingadvies en bedrijfsadvisering. Gespecialiseerd in MKB en internationale bedrijven. Gepassioneerd over financiële transparantie en compliance.',
    photoUrl: 'https://randomuser.me/api/portraits/men/67.jpg',
    contact: {
      email: 'daan.bakker@email.nl',
      phone: '+31 6 45678901',
      location: 'Rotterdam, Nederland'
    },
    experience: [
      {
        title: 'Senior Accountant',
        company: 'KPMG Nederland',
        location: 'Rotterdam',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Financiële controles voor MKB en grote ondernemingen',
          'Belastingadvies en planning',
          'Begeleiding van klanten bij overnames en fusies',
          'Leiding aan team van 4 junior accountants'
        ]
      },
      {
        title: 'Accountant',
        company: 'Deloitte',
        location: 'Amsterdam',
        dates: '2011 - 2018',
        achievements: [
          'Jaarrekeningen en belastingaangiftes',
          'Financiële analyses en rapportages',
          'Klantadvisering over fiscale optimalisatie'
        ]
      }
    ],
    education: [
      {
        institution: 'Erasmus Universiteit Rotterdam',
        degree: 'Master Accountancy',
        field: 'Accountancy',
        dates: '2007 - 2011',
        achievements: ['Registeraccountant (RA) titel behaald', 'Cum Laude afgestudeerd']
      }
    ],
    skills: {
      technical: ['Excel', 'SAP', 'IFRS', 'Belastingwetgeving', 'Financiële analyse'],
      soft: ['Analytisch denken', 'Precisie', 'Communicatie', 'Klantgerichtheid']
    },
    certifications: [
      { title: 'Registeraccountant (RA)', institution: 'NBA', year: '2011' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
    hobbies: ['Golf', 'Lezen', 'Reizen', 'Fotografie']
  },
  'marketing-manager': {
    template: 'modern',
    fullName: 'Lisa Meijer',
    title: 'Marketing Manager',
    summary: 'Strategische marketing professional met 9 jaar ervaring in digitale marketing, brand management en campagne ontwikkeling. Gespecialiseerd in B2B marketing en data-driven besluitvorming. Gepassioneerd over groei en innovatie.',
    photoUrl: 'https://randomuser.me/api/portraits/women/41.jpg',
    contact: {
      email: 'lisa.meijer@email.nl',
      phone: '+31 6 56789012',
      location: 'Amsterdam, Nederland',
      linkedin: 'linkedin.com/in/lisameijer'
    },
    experience: [
      {
        title: 'Marketing Manager',
        company: 'TechStart BV',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Ontwikkeling en uitvoering van marketingstrategie',
          'Leiding aan team van 5 marketing professionals',
          'Groei van lead generatie met 150% in 2 jaar',
          'Budgetbeheer van €500K+ per jaar'
        ]
      },
      {
        title: 'Senior Marketing Specialist',
        company: 'Global Brands Inc.',
        location: 'Utrecht',
        dates: '2016 - 2020',
        achievements: [
          'Campagne ontwikkeling voor internationale merken',
          'Social media strategie en content marketing',
          'SEO/SEM optimalisatie',
          'ROI verbetering met 40%'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit van Amsterdam',
        degree: 'Master Marketing',
        field: 'Marketing & Communicatie',
        dates: '2013 - 2016',
        achievements: ['Specialisatie in Digital Marketing']
      }
    ],
    skills: {
      technical: ['Google Analytics', 'HubSpot', 'SEO/SEM', 'Social Media Marketing', 'Content Marketing'],
      soft: ['Strategisch denken', 'Creativiteit', 'Data analyse', 'Projectmanagement']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
    hobbies: ['Fotografie', 'Reizen', 'Yoga', 'Koken']
  },
  'graphic-designer': {
    template: 'modern',
    fullName: 'Noah Smit',
    title: 'Grafisch Ontwerper',
    summary: 'Creatieve grafisch ontwerper met 6 jaar ervaring in branding, webdesign en print design. Gespecialiseerd in visuele identiteit en user experience design. Gepassioneerd over minimalisme en functioneel design.',
    photoUrl: 'https://randomuser.me/api/portraits/men/52.jpg',
    contact: {
      email: 'noah.smit@email.nl',
      phone: '+31 6 67890123',
      location: 'Eindhoven, Nederland',
      website: 'noahsmit.design'
    },
    experience: [
      {
        title: 'Senior Grafisch Ontwerper',
        company: 'Creative Agency Amsterdam',
        location: 'Amsterdam',
        dates: '2021 - Heden',
        current: true,
        achievements: [
          'Ontwerp van visuele identiteiten voor 20+ merken',
          'Webdesign en UI/UX voor digitale producten',
          'Leiding aan creatief team van 3 designers',
          'Winnende designs voor 5 design awards'
        ]
      },
      {
        title: 'Grafisch Ontwerper',
        company: 'Design Studio Rotterdam',
        location: 'Rotterdam',
        dates: '2018 - 2021',
        achievements: [
          'Print design voor brochures en magazines',
          'Branding en logo ontwerp',
          'Samenwerking met klanten en accountmanagers'
        ]
      }
    ],
    education: [
      {
        institution: 'Design Academy Eindhoven',
        degree: 'Bachelor Grafisch Ontwerp',
        field: 'Grafisch Ontwerp',
        dates: '2014 - 2018',
        achievements: ['Eindexamenproject met onderscheiding']
      }
    ],
    skills: {
      technical: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Illustrator', 'Photoshop', 'InDesign'],
      soft: ['Creativiteit', 'Visuele communicatie', 'Klantgerichtheid', 'Tijdsbeheer']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Fotografie', 'Kunst', 'Fietsen', 'Muziek']
  },
  'administrative-assistant': {
    template: 'modern',
    fullName: 'Eva Mulder',
    title: 'Management Assistent',
    summary: 'Proactieve management assistent met 8 jaar ervaring in administratieve ondersteuning, planning en klantenservice. Gespecialiseerd in efficiënte workflow management en executive support. Gepassioneerd over organisatie en service excellence.',
    photoUrl: 'https://randomuser.me/api/portraits/women/35.jpg',
    contact: {
      email: 'eva.mulder@email.nl',
      phone: '+31 6 78901234',
      location: 'Utrecht, Nederland'
    },
    experience: [
      {
        title: 'Management Assistent',
        company: 'Corporate Solutions BV',
        location: 'Utrecht',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Ondersteuning van directie en management team',
          'Agenda beheer en reisplanning',
          'Organisatie van meetings en events',
          'Beheer van administratieve systemen'
        ]
      },
      {
        title: 'Administratief Medewerker',
        company: 'Business Services Nederland',
        location: 'Amsterdam',
        dates: '2015 - 2019',
        achievements: [
          'Klantenservice en telefoonbeantwoording',
          'Data invoer en bestandsbeheer',
          'Facturering en boekhouding ondersteuning'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Midden Nederland',
        degree: 'MBO Secretarieel',
        field: 'Administratie',
        dates: '2012 - 2015',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Microsoft Office', 'Outlook', 'CRM systemen', 'Boekhoudsoftware'],
      soft: ['Organisatie', 'Communicatie', 'Discretie', 'Multitasking', 'Proactiviteit']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
    hobbies: ['Lezen', 'Wandelen', 'Koken', 'Vrijwilligerswerk']
  },
  'engineer': {
    template: 'modern',
    fullName: 'Thomas de Wit',
    title: 'Ingenieur',
    summary: 'Ervaren ingenieur met 11 jaar ervaring in projectmanagement, technisch ontwerp en kwaliteitscontrole. Gespecialiseerd in infrastructurele projecten en duurzame oplossingen. Gepassioneerd over innovatie en technische excellentie.',
    photoUrl: 'https://randomuser.me/api/portraits/men/38.jpg',
    contact: {
      email: 'thomas.dewit@email.nl',
      phone: '+31 6 89012345',
      location: 'Delft, Nederland'
    },
    experience: [
      {
        title: 'Senior Project Ingenieur',
        company: 'Royal HaskoningDHV',
        location: 'Rotterdam',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Leiding aan infrastructurele projecten van €10M+',
          'Technisch ontwerp en engineering',
          'Coördinatie met aannemers en stakeholders',
          'Kwaliteitscontrole en veiligheidsmanagement'
        ]
      },
      {
        title: 'Ingenieur',
        company: 'Arcadis Nederland',
        location: 'Amsterdam',
        dates: '2012 - 2018',
        achievements: [
          'Ontwerp van bruggen en viaducten',
          'Berekeningen en technische tekeningen',
          'Projectondersteuning en rapportage'
        ]
      }
    ],
    education: [
      {
        institution: 'Technische Universiteit Delft',
        degree: 'Master Civiele Techniek',
        field: 'Civiele Techniek',
        dates: '2007 - 2012',
        achievements: ['Ingenieurstitel behaald', 'Specialisatie in Constructies']
      }
    ],
    skills: {
      technical: ['AutoCAD', 'Revit', 'Projectmanagement', 'Berekeningen', 'Risicoanalyse'],
      soft: ['Probleemoplossend denken', 'Leiderschap', 'Communicatie', 'Teamwerk']
    },
    certifications: [
      { title: 'Project Management Professional (PMP)', institution: 'PMI', year: '2019' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Fietsen', 'Fotografie', 'Lezen', 'Reizen']
  },
  'sales-representative': {
    template: 'modern',
    fullName: 'Max van Leeuwen',
    title: 'Account Manager',
    summary: 'Resultaatgerichte sales professional met 7 jaar ervaring in B2B verkoop en account management. Gespecialiseerd in lange termijn klantrelaties en complexe sales cycles. Gepassioneerd over het helpen van klanten bij het bereiken van hun doelen.',
    photoUrl: 'https://randomuser.me/api/portraits/men/61.jpg',
    contact: {
      email: 'max.vanleeuwen@email.nl',
      phone: '+31 6 90123456',
      location: 'Amsterdam, Nederland',
      linkedin: 'linkedin.com/in/maxvanleeuwen'
    },
    experience: [
      {
        title: 'Senior Account Manager',
        company: 'Enterprise Solutions BV',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Beheer van portefeuille van 50+ enterprise klanten',
          'Jaarlijkse omzet van €2M+',
          'Uitbreiding van klantrelaties en cross-selling',
          'Leiding aan sales team van 3 accountmanagers'
        ]
      },
      {
        title: 'Account Manager',
        company: 'Business Sales Nederland',
        location: 'Utrecht',
        dates: '2017 - 2020',
        achievements: [
          'Nieuwe klanten acquisitie',
          'Presentaties en productdemonstraties',
          'Contractonderhandelingen',
          '150% van sales target behaald in 2019'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool van Amsterdam',
        degree: 'Bachelor Commerciële Economie',
        field: 'Sales & Marketing',
        dates: '2013 - 2017',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['CRM systemen', 'Sales forecasting', 'Presentatievaardigheden', 'Contractonderhandeling'],
      soft: ['Relatiebeheer', 'Communicatie', 'Overtuigingskracht', 'Resultaatgerichtheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
    hobbies: ['Netwerken', 'Golf', 'Reizen', 'Lezen']
  },
  'chef': {
    template: 'modern',
    fullName: 'Anna van Dijk',
    title: 'Hoofdchef',
    summary: 'Creatieve chef met 10 jaar ervaring in fine dining en restaurant management. Gespecialiseerd in moderne Europese keuken en seizoensgebonden ingrediënten. Gepassioneerd over culinaire innovatie en teamontwikkeling.',
    photoUrl: 'https://randomuser.me/api/portraits/women/47.jpg',
    contact: {
      email: 'anna.vandijk@email.nl',
      phone: '+31 6 01234567',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Hoofdchef',
        company: 'Restaurant De Gouden Leeuw',
        location: 'Amsterdam',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Leiding aan keukenbrigade van 8 koks',
          'Ontwikkeling van seizoensmenu\'s',
          'Michelin ster behouden sinds 2020',
          'Kostenbeheer en inkoop optimalisatie'
        ]
      },
      {
        title: 'Sous Chef',
        company: 'Restaurant Le Jardin',
        location: 'Rotterdam',
        dates: '2015 - 2019',
        achievements: [
          'Assistentie bij menu ontwikkeling',
          'Training van junior koks',
          'Kwaliteitscontrole en food safety'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Amsterdam',
        degree: 'MBO Kok',
        field: 'Horeca',
        dates: '2010 - 2014',
        achievements: ['Diploma behaald', 'Stage bij sterrenrestaurant']
      }
    ],
    skills: {
      technical: ['Menu ontwikkeling', 'Food safety', 'Kostenbeheer', 'Kitchen management'],
      soft: ['Creativiteit', 'Leiderschap', 'Stressbestendigheid', 'Teamwerk']
    },
    certifications: [
      { title: 'HACCP Certificaat', institution: 'HACCP Nederland', year: '2015' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
    hobbies: ['Koken', 'Wijnproeven', 'Reizen', 'Fotografie']
  },
  'lawyer': {
    template: 'modern',
    fullName: 'Julia Hendriks',
    title: 'Advocaat',
    summary: 'Ervaren advocaat met 9 jaar ervaring in corporate law en contractenrecht. Gespecialiseerd in M&A transacties en commerciële geschillen. Gepassioneerd over juridische excellentie en klantgerichtheid.',
    photoUrl: 'https://randomuser.me/api/portraits/women/39.jpg',
    contact: {
      email: 'julia.hendriks@email.nl',
      phone: '+31 6 12345098',
      location: 'Den Haag, Nederland'
    },
    experience: [
      {
        title: 'Senior Advocaat',
        company: 'Legal Partners Advocaten',
        location: 'Den Haag',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Begeleiding van M&A transacties tot €50M',
          'Contractonderhandelingen en due diligence',
          'Geschilbeslechting en arbitrage',
          'Leiding aan team van 3 junior advocaten'
        ]
      },
      {
        title: 'Advocaat',
        company: 'Corporate Law Firm Amsterdam',
        location: 'Amsterdam',
        dates: '2014 - 2018',
        achievements: [
          'Juridisch advies aan bedrijven',
          'Contracten opstellen en beoordelen',
          'Rechtspraak en procedures'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit Leiden',
        degree: 'Master Rechtsgeleerdheid',
        field: 'Privaatrecht',
        dates: '2009 - 2014',
        achievements: ['Masterdiploma behaald', 'Stage bij advocatenkantoor']
      }
    ],
    skills: {
      technical: ['Contractrecht', 'Ondernemingsrecht', 'M&A', 'Geschilbeslechting'],
      soft: ['Analytisch denken', 'Communicatie', 'Onderhandelen', 'Precisie']
    },
    certifications: [
      { title: 'Advocatenregister', institution: 'Nederlandse Orde van Advocaten', year: '2014' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
    hobbies: ['Lezen', 'Tennis', 'Reizen', 'Muziek']
  },
  'data-scientist': {
    template: 'modern',
    fullName: 'Ruben Visser',
    title: 'Data Scientist',
    summary: 'Data scientist met 6 jaar ervaring in machine learning, predictive analytics en data engineering. Gespecialiseerd in Python, SQL en cloud platforms. Gepassioneerd over het omzetten van data in actionable insights.',
    photoUrl: 'https://randomuser.me/api/portraits/men/43.jpg',
    contact: {
      email: 'ruben.visser@email.nl',
      phone: '+31 6 23450987',
      location: 'Amsterdam, Nederland',
      linkedin: 'linkedin.com/in/rubenvisser'
    },
    experience: [
      {
        title: 'Senior Data Scientist',
        company: 'Data Analytics BV',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Ontwikkeling van ML modellen voor voorspellingen',
          'Data pipeline engineering en ETL processen',
          'Presentatie van insights aan stakeholders',
          'Leiding aan team van 4 data scientists'
        ]
      },
      {
        title: 'Data Scientist',
        company: 'Tech Innovations',
        location: 'Utrecht',
        dates: '2017 - 2020',
        achievements: [
          'Analyse van grote datasets',
          'Machine learning model ontwikkeling',
          'Data visualisatie en rapportage'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit van Amsterdam',
        degree: 'Master Data Science',
        field: 'Data Science',
        dates: '2014 - 2017',
        achievements: ['Cum Laude afgestudeerd', 'Scriptie over deep learning']
      }
    ],
    skills: {
      technical: ['Python', 'SQL', 'Machine Learning', 'TensorFlow', 'AWS', 'Tableau'],
      soft: ['Analytisch denken', 'Probleemoplossend', 'Communicatie', 'Teamwerk']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Programmeren', 'Gaming', 'Fietsen', 'Lezen']
  },
  'doctor': {
    template: 'modern',
    fullName: 'Dr. Bas van den Berg',
    title: 'Huisarts',
    summary: 'Ervaren huisarts met 12 jaar ervaring in eerstelijns gezondheidszorg. Gespecialiseerd in preventieve zorg en chronische ziektebeheer. Gepassioneerd over patiëntgerichte zorg en continue medische educatie.',
    photoUrl: 'https://randomuser.me/api/portraits/men/55.jpg',
    contact: {
      email: 'bas.vandenberg@email.nl',
      phone: '+31 6 34509876',
      location: 'Utrecht, Nederland'
    },
    experience: [
      {
        title: 'Huisarts',
        company: 'Huisartsenpraktijk De Bilt',
        location: 'Utrecht',
        dates: '2015 - Heden',
        current: true,
        achievements: [
          'Zorg voor 2000+ patiënten',
          'Preventieve zorg en gezondheidsvoorlichting',
          'Chronische ziektebeheer (diabetes, hypertensie)',
          'Samenwerking met specialisten en ziekenhuizen'
        ]
      },
      {
        title: 'Arts-assistent',
        company: 'UMC Utrecht',
        location: 'Utrecht',
        dates: '2011 - 2015',
        achievements: [
          'Rotaties op verschillende afdelingen',
          'Onderzoek en wetenschappelijke publicaties',
          'Training in verschillende specialismen'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit Utrecht',
        degree: 'Master Geneeskunde',
        field: 'Geneeskunde',
        dates: '2004 - 2011',
        achievements: ['Basisarts diploma', 'Specialisatie Huisartsgeneeskunde']
      }
    ],
    skills: {
      technical: ['Diagnostiek', 'Behandelplanning', 'Medische procedures', 'EPD systemen'],
      soft: ['Empathie', 'Communicatie', 'Stressbestendigheid', 'Besluitvorming']
    },
    certifications: [
      { title: 'BIG Registratie', institution: 'BIG Register', year: '2011' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
    hobbies: ['Hardlopen', 'Lezen', 'Reizen', 'Fotografie']
  },
  'pharmacist': {
    template: 'modern',
    fullName: 'Marieke van der Laan',
    title: 'Apotheker',
    summary: 'Ervaren apotheker met 8 jaar ervaring in community pharmacy en medicatiebeheer. Gespecialiseerd in farmaceutische zorg en medicatiebeoordeling. Gepassioneerd over patiëntveiligheid en medicatieoptimalisatie.',
    photoUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    contact: {
      email: 'marieke.vanderlaan@email.nl',
      phone: '+31 6 45098765',
      location: 'Rotterdam, Nederland'
    },
    experience: [
      {
        title: 'Apotheker',
        company: 'Apotheek Centrum Rotterdam',
        location: 'Rotterdam',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Medicatiebeoordeling en -advies',
          'Farmaceutische patiëntenzorg',
          'Samenwerking met huisartsen en specialisten',
          'Leiding aan team van 5 medewerkers'
        ]
      },
      {
        title: 'Apotheker in opleiding',
        company: 'Ziekenhuisapotheek Erasmus MC',
        location: 'Rotterdam',
        dates: '2015 - 2018',
        achievements: [
          'Medicatiebereiding en -controle',
          'Klinische farmacie',
          'Onderzoek en ontwikkeling'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit Utrecht',
        degree: 'Master Farmacie',
        field: 'Farmacie',
        dates: '2010 - 2015',
        achievements: ['Apothekersdiploma behaald']
      }
    ],
    skills: {
      technical: ['Medicatiebeoordeling', 'Farmaceutische bereiding', 'Drug interactions', 'Farmaceutische zorg'],
      soft: ['Precisie', 'Communicatie', 'Empathie', 'Teamwerk']
    },
    certifications: [
      { title: 'BIG Registratie', institution: 'BIG Register', year: '2015' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Lezen', 'Yoga', 'Koken', 'Reizen']
  },
  'it-support': {
    template: 'modern',
    fullName: 'Kevin de Boer',
    title: 'IT Support Specialist',
    summary: 'Technische IT support specialist met 5 jaar ervaring in helpdesk support, systeembeheer en troubleshooting. Gespecialiseerd in Windows en Linux systemen. Gepassioneerd over probleemoplossing en klanttevredenheid.',
    photoUrl: 'https://randomuser.me/api/portraits/men/49.jpg',
    contact: {
      email: 'kevin.deboer@email.nl',
      phone: '+31 6 50987654',
      location: 'Eindhoven, Nederland'
    },
    experience: [
      {
        title: 'Senior IT Support Specialist',
        company: 'IT Services Nederland',
        location: 'Eindhoven',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Eerste en tweede lijns support voor 500+ gebruikers',
          'Systeembeheer en onderhoud',
          'Implementatie van nieuwe IT systemen',
          'Training van gebruikers en junior medewerkers'
        ]
      },
      {
        title: 'IT Support Medewerker',
        company: 'TechSupport BV',
        location: 'Amsterdam',
        dates: '2018 - 2020',
        achievements: [
          'Helpdesk support via telefoon en email',
          'Troubleshooting hardware en software problemen',
          'Ticket management en escalatie'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Eindhoven',
        degree: 'MBO ICT Beheer',
        field: 'ICT',
        dates: '2015 - 2018',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Windows Server', 'Linux', 'Active Directory', 'Networking', 'Troubleshooting'],
      soft: ['Klantgerichtheid', 'Probleemoplossend', 'Communicatie', 'Geduld']
    },
    certifications: [
      { title: 'CompTIA A+', institution: 'CompTIA', year: '2019' },
      { title: 'Microsoft Certified Professional', institution: 'Microsoft', year: '2020' }
    ],
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Gaming', 'Programmeren', 'Fietsen', 'Muziek']
  },
  'professor': {
    template: 'modern',
    fullName: 'Prof. Dr. Sarah van der Meer',
    title: 'Hoogleraar',
    summary: 'Gerenommeerde hoogleraar met 15+ jaar ervaring in onderzoek en onderwijs. Gespecialiseerd in sociale psychologie en gedragswetenschappen. Gepassioneerd over wetenschappelijk onderzoek en kennisoverdracht.',
    photoUrl: 'https://randomuser.me/api/portraits/women/50.jpg',
    contact: {
      email: 'sarah.vandermeer@email.nl',
      phone: '+31 6 09876543',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Hoogleraar Sociale Psychologie',
        company: 'Universiteit van Amsterdam',
        location: 'Amsterdam',
        dates: '2016 - Heden',
        current: true,
        achievements: [
          'Onderwijs aan bachelor en master studenten',
          'Leiding aan onderzoeksgroep van 8 onderzoekers',
          '30+ wetenschappelijke publicaties',
          'Begeleiding van 15+ promovendi'
        ]
      },
      {
        title: 'Universitair Docent',
        company: 'Universiteit Leiden',
        location: 'Leiden',
        dates: '2010 - 2016',
        achievements: [
          'Onderwijs en onderzoek',
          'Begeleiding van studenten',
          'Wetenschappelijke publicaties'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit van Amsterdam',
        degree: 'PhD Psychologie',
        field: 'Sociale Psychologie',
        dates: '2005 - 2010',
        achievements: ['Promotie cum laude']
      }
    ],
    skills: {
      technical: ['Onderzoeksmethoden', 'Statistiek', 'Data analyse', 'Wetenschappelijk schrijven'],
      soft: ['Onderwijs', 'Mentoring', 'Presentatie', 'Kritisch denken']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
    hobbies: ['Lezen', 'Schrijven', 'Wandelen', 'Muziek']
  },
  'school-counselor': {
    template: 'modern',
    fullName: 'Iris van der Wal',
    title: 'Schooldecaan',
    summary: 'Ervaren schooldecaan met 7 jaar ervaring in studie- en loopbaanbegeleiding. Gespecialiseerd in het ondersteunen van leerlingen bij studiekeuze en persoonlijke ontwikkeling. Gepassioneerd over het helpen van jongeren bij het bereiken van hun potentieel.',
    photoUrl: 'https://randomuser.me/api/portraits/women/33.jpg',
    contact: {
      email: 'iris.vanderwal@email.nl',
      phone: '+31 6 98765432',
      location: 'Groningen, Nederland'
    },
    experience: [
      {
        title: 'Schooldecaan',
        company: 'Stedelijk Gymnasium Groningen',
        location: 'Groningen',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Begeleiding van 300+ leerlingen per jaar',
          'Studie- en loopbaanadvies',
          'Organisatie van voorlichtingsactiviteiten',
          'Samenwerking met ouders en docenten'
        ]
      },
      {
        title: 'Decaan',
        company: 'VMBO School De Horizon',
        location: 'Leeuwarden',
        dates: '2016 - 2019',
        achievements: [
          'Loopbaanoriëntatie en -begeleiding',
          'Individuele gesprekken met leerlingen',
          'Organisatie van stages en bedrijfsbezoeken'
        ]
      }
    ],
    education: [
      {
        institution: 'Rijksuniversiteit Groningen',
        degree: 'Master Onderwijskunde',
        field: 'Onderwijs',
        dates: '2012 - 2016',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Loopbaanbegeleiding', 'Studieadvies', 'Coaching', 'Assessment'],
      soft: ['Empathie', 'Communicatie', 'Geduld', 'Luistervaardigheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Lezen', 'Yoga', 'Wandelen', 'Vrijwilligerswerk']
  },
  'financial-analyst': {
    template: 'modern',
    fullName: 'Dennis van der Veen',
    title: 'Financieel Analist',
    summary: 'Analytische financieel analist met 6 jaar ervaring in financiële analyse, forecasting en risicobeheer. Gespecialiseerd in corporate finance en investment analysis. Gepassioneerd over data-driven besluitvorming.',
    photoUrl: 'https://randomuser.me/api/portraits/men/56.jpg',
    contact: {
      email: 'dennis.vanderveen@email.nl',
      phone: '+31 6 87654321',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Senior Financieel Analist',
        company: 'Investment Bank Amsterdam',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Financiële modellen en forecasting',
          'Due diligence voor M&A transacties',
          'Risicoanalyse en -beheer',
          'Presentaties aan management en investeerders'
        ]
      },
      {
        title: 'Financieel Analist',
        company: 'Corporate Finance BV',
        location: 'Rotterdam',
        dates: '2017 - 2020',
        achievements: [
          'Financiële rapportages en analyses',
          'Budgettering en planning',
          'KPI monitoring en rapportage'
        ]
      }
    ],
    education: [
      {
        institution: 'Erasmus Universiteit Rotterdam',
        degree: 'Master Finance & Investment',
        field: 'Finance',
        dates: '2014 - 2017',
        achievements: ['Cum Laude afgestudeerd']
      }
    ],
    skills: {
      technical: ['Excel', 'Financial modeling', 'SQL', 'Bloomberg', 'Risk analysis'],
      soft: ['Analytisch denken', 'Aandacht voor detail', 'Communicatie', 'Teamwerk']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
    hobbies: ['Golf', 'Lezen', 'Reizen', 'Fotografie']
  },
  'photographer': {
    template: 'modern',
    fullName: 'Fleur van der Berg',
    title: 'Fotograaf',
    summary: 'Creatieve professionele fotograaf met 8 jaar ervaring in portret-, bruilofts- en commerciële fotografie. Gespecialiseerd in natuurlijk licht en storytelling. Gepassioneerd over het vastleggen van authentieke momenten.',
    photoUrl: 'https://randomuser.me/api/portraits/women/46.jpg',
    contact: {
      email: 'fleur.vanderberg@email.nl',
      phone: '+31 6 76543210',
      location: 'Amsterdam, Nederland',
      website: 'fleurfotografie.nl'
    },
    experience: [
      {
        title: 'Zelfstandig Fotograaf',
        company: 'Fleur Fotografie',
        location: 'Amsterdam',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Portret- en bruiloftsfotografie',
          'Commerciële opdrachten voor merken',
          '100+ tevreden klanten',
          'Publicaties in verschillende magazines'
        ]
      },
      {
        title: 'Fotograaf',
        company: 'Creative Studio Amsterdam',
        location: 'Amsterdam',
        dates: '2015 - 2018',
        achievements: [
          'Product- en fashion fotografie',
          'Samenwerking met modellen en stylisten',
          'Post-productie en beeldbewerking'
        ]
      }
    ],
    education: [
      {
        institution: 'Fotovakschool Amsterdam',
        degree: 'MBO Fotografie',
        field: 'Fotografie',
        dates: '2012 - 2015',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Adobe Lightroom', 'Photoshop', 'Camera techniek', 'Compositie', 'Lighting'],
      soft: ['Creativiteit', 'Communicatie', 'Klantgerichtheid', 'Flexibiliteit']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Fotografie', 'Reizen', 'Kunst', 'Muziek']
  },
  'copywriter': {
    template: 'modern',
    fullName: 'Roos van der Laan',
    title: 'Copywriter',
    summary: 'Creatieve copywriter met 5 jaar ervaring in content marketing, advertising en brand storytelling. Gespecialiseerd in digitale content en social media. Gepassioneerd over het creëren van overtuigende verhalen die resulteren.',
    photoUrl: 'https://randomuser.me/api/portraits/women/42.jpg',
    contact: {
      email: 'roos.vanderlaan@email.nl',
      phone: '+31 6 65432109',
      location: 'Utrecht, Nederland'
    },
    experience: [
      {
        title: 'Senior Copywriter',
        company: 'Marketing Agency Utrecht',
        location: 'Utrecht',
        dates: '2021 - Heden',
        current: true,
        achievements: [
          'Content strategie en creatie voor 20+ merken',
          'Campagne ontwikkeling en copywriting',
          'Social media content en storytelling',
          'Leiding aan team van 3 copywriters'
        ]
      },
      {
        title: 'Copywriter',
        company: 'Digital Content BV',
        location: 'Amsterdam',
        dates: '2018 - 2021',
        achievements: [
          'Blog posts en artikelen',
          'Website copy en landing pages',
          'Email marketing campagnes'
        ]
      }
    ],
    education: [
      {
        institution: 'Universiteit Utrecht',
        degree: 'Bachelor Communicatiewetenschap',
        field: 'Communicatie',
        dates: '2014 - 2018',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Copywriting', 'Content strategie', 'SEO', 'Social media', 'Email marketing'],
      soft: ['Creativiteit', 'Schrijven', 'Storytelling', 'Teamwerk']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Schrijven', 'Lezen', 'Reizen', 'Kunst']
  },
  'mechanical-engineer': {
    template: 'modern',
    fullName: 'Joris van der Meulen',
    title: 'Werktuigbouwkundig Ingenieur',
    summary: 'Ervaren werktuigbouwkundig ingenieur met 9 jaar ervaring in productontwikkeling en machine design. Gespecialiseerd in CAD/CAM en prototyping. Gepassioneerd over innovatie en technische oplossingen.',
    photoUrl: 'https://randomuser.me/api/portraits/men/59.jpg',
    contact: {
      email: 'joris.vandermeulen@email.nl',
      phone: '+31 6 54321098',
      location: 'Eindhoven, Nederland'
    },
    experience: [
      {
        title: 'Senior Product Engineer',
        company: 'ASML',
        location: 'Veldhoven',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Ontwerp en ontwikkeling van precisie componenten',
          'CAD/CAM engineering en prototyping',
          'Kwaliteitscontrole en testing',
          'Leiding aan engineering team'
        ]
      },
      {
        title: 'Mechanical Engineer',
        company: 'Philips Engineering',
        location: 'Eindhoven',
        dates: '2014 - 2018',
        achievements: [
          'Product design en ontwikkeling',
          'Materiaalkeuze en optimalisatie',
          'Samenwerking met productie en R&D'
        ]
      }
    ],
    education: [
      {
        institution: 'Technische Universiteit Eindhoven',
        degree: 'Master Werktuigbouwkunde',
        field: 'Mechanical Engineering',
        dates: '2009 - 2014',
        achievements: ['Ingenieurstitel behaald']
      }
    ],
    skills: {
      technical: ['SolidWorks', 'AutoCAD', 'FEM Analysis', 'Prototyping', '3D Printing'],
      soft: ['Probleemoplossend', 'Precisie', 'Teamwerk', 'Innovatie']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['3D Printing', 'Fietsen', 'Technologie', 'Lezen']
  },
  'civil-engineer': {
    template: 'modern',
    fullName: 'Marijn van der Steen',
    title: 'Civiel Ingenieur',
    summary: 'Ervaren civiel ingenieur met 10 jaar ervaring in infrastructurele projecten en bouwmanagement. Gespecialiseerd in bruggen en wegenbouw. Gepassioneerd over duurzame infrastructuur en veiligheid.',
    photoUrl: 'https://randomuser.me/api/portraits/men/48.jpg',
    contact: {
      email: 'marijn.vandersteen@email.nl',
      phone: '+31 6 43210987',
      location: 'Rotterdam, Nederland'
    },
    experience: [
      {
        title: 'Project Manager Civiele Techniek',
        company: 'BAM Infra',
        location: 'Rotterdam',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Leiding aan infrastructurele projecten van €15M+',
          'Planning en uitvoering van wegen- en waterbouwprojecten',
          'Coördinatie met aannemers en stakeholders',
          'Kwaliteits- en veiligheidsmanagement'
        ]
      },
      {
        title: 'Civiel Ingenieur',
        company: 'Royal HaskoningDHV',
        location: 'Rotterdam',
        dates: '2013 - 2019',
        achievements: [
          'Ontwerp van bruggen en viaducten',
          'Berekeningen en technische tekeningen',
          'Projectondersteuning'
        ]
      }
    ],
    education: [
      {
        institution: 'Technische Universiteit Delft',
        degree: 'Master Civiele Techniek',
        field: 'Civiele Techniek',
        dates: '2008 - 2013',
        achievements: ['Ingenieurstitel behaald']
      }
    ],
    skills: {
      technical: ['AutoCAD', 'Revit', 'Projectmanagement', 'Berekeningen', 'Risicoanalyse'],
      soft: ['Leiderschap', 'Communicatie', 'Probleemoplossend', 'Teamwerk']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Fietsen', 'Fotografie', 'Lezen', 'Reizen']
  },
  'account-manager': {
    template: 'modern',
    fullName: 'Sanne van der Pol',
    title: 'Account Manager',
    summary: 'Resultaatgerichte account manager met 6 jaar ervaring in B2B account management en klantrelaties. Gespecialiseerd in enterprise accounts en complexe sales. Gepassioneerd over het helpen van klanten bij succes.',
    photoUrl: 'https://randomuser.me/api/portraits/women/40.jpg',
    contact: {
      email: 'sanne.vanderpol@email.nl',
      phone: '+31 6 32109876',
      location: 'Amsterdam, Nederland',
      linkedin: 'linkedin.com/in/sannevanderpol'
    },
    experience: [
      {
        title: 'Senior Account Manager',
        company: 'Enterprise Solutions',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Beheer van portefeuille van 40+ enterprise klanten',
          'Jaarlijkse omzet van €1.8M+',
          'Uitbreiding van klantrelaties en upselling',
          'Leiding aan account team'
        ]
      },
      {
        title: 'Account Manager',
        company: 'Business Sales Nederland',
        location: 'Utrecht',
        dates: '2017 - 2020',
        achievements: [
          'Nieuwe klanten acquisitie',
          'Presentaties en productdemonstraties',
          'Contractonderhandelingen',
          '140% van sales target behaald'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool van Amsterdam',
        degree: 'Bachelor Commerciële Economie',
        field: 'Sales & Marketing',
        dates: '2013 - 2017',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['CRM systemen', 'Sales forecasting', 'Presentatievaardigheden', 'Contractonderhandeling'],
      soft: ['Relatiebeheer', 'Communicatie', 'Overtuigingskracht', 'Resultaatgerichtheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Goed)'],
    hobbies: ['Netwerken', 'Golf', 'Reizen', 'Lezen']
  },
  'retail-manager': {
    template: 'modern',
    fullName: 'Tim van der Zee',
    title: 'Winkelmanager',
    summary: 'Ervaren winkelmanager met 8 jaar ervaring in retail management en klantenservice. Gespecialiseerd in teamleiderschap en omzetoptimalisatie. Gepassioneerd over klanttevredenheid en operationele excellentie.',
    photoUrl: 'https://randomuser.me/api/portraits/men/57.jpg',
    contact: {
      email: 'tim.vanderzee@email.nl',
      phone: '+31 6 21098765',
      location: 'Rotterdam, Nederland'
    },
    experience: [
      {
        title: 'Winkelmanager',
        company: 'H&M Nederland',
        location: 'Rotterdam',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Leiding aan team van 15 medewerkers',
          'Omzetoptimalisatie en voorraadbeheer',
          'Klantenservice en tevredenheid',
          'Implementatie van nieuwe processen'
        ]
      },
      {
        title: 'Assistent Winkelmanager',
        company: 'Zara Nederland',
        location: 'Amsterdam',
        dates: '2015 - 2019',
        achievements: [
          'Ondersteuning bij dagelijkse operaties',
          'Training van nieuwe medewerkers',
          'Voorraadbeheer en bestellingen'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Rotterdam',
        degree: 'MBO Retail Management',
        field: 'Retail',
        dates: '2012 - 2015',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Retail systemen', 'Voorraadbeheer', 'Omzetanalyse', 'Planning'],
      soft: ['Leiderschap', 'Klantgerichtheid', 'Teamwerk', 'Organisatie']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
    hobbies: ['Fitness', 'Reizen', 'Muziek', 'Lezen']
  },
  'office-manager': {
    template: 'modern',
    fullName: 'Lotte van der Heijden',
    title: 'Kantoor Manager',
    summary: 'Proactieve kantoor manager met 7 jaar ervaring in office management, HR en administratie. Gespecialiseerd in efficiënte workflow en teamcoördinatie. Gepassioneerd over het creëren van een positieve werkomgeving.',
    photoUrl: 'https://randomuser.me/api/portraits/women/36.jpg',
    contact: {
      email: 'lotte.vanderheijden@email.nl',
      phone: '+31 6 10987654',
      location: 'Utrecht, Nederland'
    },
    experience: [
      {
        title: 'Kantoor Manager',
        company: 'Business Services BV',
        location: 'Utrecht',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Leiding aan administratief team van 8 medewerkers',
          'HR ondersteuning en recruitment',
          'Facility management en inkoop',
          'Budgetbeheer en rapportage'
        ]
      },
      {
        title: 'Office Coordinator',
        company: 'Corporate Solutions',
        location: 'Amsterdam',
        dates: '2016 - 2020',
        achievements: [
          'Administratieve ondersteuning',
          'Agenda beheer en planning',
          'Event organisatie'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool Utrecht',
        degree: 'Bachelor Business Administration',
        field: 'Bedrijfskunde',
        dates: '2012 - 2016',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Microsoft Office', 'HR systemen', 'Boekhoudsoftware', 'Projectmanagement'],
      soft: ['Organisatie', 'Communicatie', 'Leiderschap', 'Multitasking']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Duits (Basis)'],
    hobbies: ['Yoga', 'Lezen', 'Koken', 'Wandelen']
  },
  'executive-assistant': {
    template: 'modern',
    fullName: 'Niels van der Vliet',
    title: 'Executive Assistant',
    summary: 'Ervaren executive assistant met 9 jaar ervaring in executive support en administratieve coördinatie. Gespecialiseerd in C-level ondersteuning en complexe planning. Gepassioneerd over efficiency en discretie.',
    photoUrl: 'https://randomuser.me/api/portraits/men/54.jpg',
    contact: {
      email: 'niels.vandervliet@email.nl',
      phone: '+31 6 09876543',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Executive Assistant',
        company: 'Fortune 500 Company',
        location: 'Amsterdam',
        dates: '2018 - Heden',
        current: true,
        achievements: [
          'Ondersteuning van CEO en directie',
          'Complexe agenda beheer en reisplanning',
          'Organisatie van board meetings en events',
          'Vertrouwelijke documentbeheer'
        ]
      },
      {
        title: 'Management Assistant',
        company: 'Corporate Amsterdam',
        location: 'Amsterdam',
        dates: '2014 - 2018',
        achievements: [
          'Ondersteuning van management team',
          'Administratieve coördinatie',
          'Klantrelaties en communicatie'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool van Amsterdam',
        degree: 'Bachelor Secretarieel',
        field: 'Administratie',
        dates: '2010 - 2014',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Microsoft Office', 'Outlook', 'CRM', 'Projectmanagement tools'],
      soft: ['Discretie', 'Organisatie', 'Communicatie', 'Proactiviteit', 'Stressbestendigheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)', 'Duits (Basis)'],
    hobbies: ['Lezen', 'Golf', 'Reizen', 'Fotografie']
  },
  'hotel-manager': {
    template: 'modern',
    fullName: 'Femke van der Berg',
    title: 'Hotel Manager',
    summary: 'Ervaren hotel manager met 10 jaar ervaring in hospitality management en gastenservice. Gespecialiseerd in luxury hotels en operationele excellentie. Gepassioneerd over het creëren van onvergetelijke gastenervaringen.',
    photoUrl: 'https://randomuser.me/api/portraits/women/38.jpg',
    contact: {
      email: 'femke.vanderberg@email.nl',
      phone: '+31 6 98765432',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Hotel Manager',
        company: 'Grand Hotel Amsterdam',
        location: 'Amsterdam',
        dates: '2019 - Heden',
        current: true,
        achievements: [
          'Leiding aan team van 50+ medewerkers',
          'Omzetoptimalisatie en budgetbeheer',
          'Gastenservice en tevredenheid',
          'Operational excellence en kwaliteitsmanagement'
        ]
      },
      {
        title: 'Front Office Manager',
        company: 'Boutique Hotel Rotterdam',
        location: 'Rotterdam',
        dates: '2015 - 2019',
        achievements: [
          'Leiding aan front office team',
          'Reservatiebeheer en revenue management',
          'Gastenservice en probleemoplossing'
        ]
      }
    ],
    education: [
      {
        institution: 'Hotelschool Den Haag',
        degree: 'Bachelor Hotel Management',
        field: 'Hospitality',
        dates: '2011 - 2015',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Hotel management systemen', 'Revenue management', 'Event planning', 'Food & Beverage'],
      soft: ['Leiderschap', 'Gastgerichtheid', 'Teamwerk', 'Probleemoplossend']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)', 'Duits (Goed)'],
    hobbies: ['Reizen', 'Koken', 'Lezen', 'Fotografie']
  },
  'restaurant-manager': {
    template: 'modern',
    fullName: 'Jeroen van der Molen',
    title: 'Restaurant Manager',
    summary: 'Ervaren restaurant manager met 8 jaar ervaring in restaurant management en gastenservice. Gespecialiseerd in fine dining en teamleiderschap. Gepassioneerd over culinaire excellentie en gasttevredenheid.',
    photoUrl: 'https://randomuser.me/api/portraits/men/60.jpg',
    contact: {
      email: 'jeroen.vandermolen@email.nl',
      phone: '+31 6 87654321',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Restaurant Manager',
        company: 'Restaurant De Gouden Leeuw',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Leiding aan team van 20+ medewerkers',
          'Dagelijkse operaties en service management',
          'Gastenservice en tevredenheid',
          'Samenwerking met keuken en sommelier'
        ]
      },
      {
        title: 'Floor Manager',
        company: 'Restaurant Le Jardin',
        location: 'Rotterdam',
        dates: '2016 - 2020',
        achievements: [
          'Service coördinatie en teamleiding',
          'Gastenservice en reserveringen',
          'Training van nieuwe medewerkers'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Amsterdam',
        degree: 'MBO Horeca Management',
        field: 'Horeca',
        dates: '2012 - 2016',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Restaurant systemen', 'Reserveringsbeheer', 'Wijnkennis', 'Food & Beverage'],
      soft: ['Leiderschap', 'Gastgerichtheid', 'Teamwerk', 'Stressbestendigheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Goed)'],
    hobbies: ['Wijnproeven', 'Koken', 'Reizen', 'Fotografie']
  },
  'paralegal': {
    template: 'modern',
    fullName: 'Maud van der Linden',
    title: 'Paralegal',
    summary: 'Ervaren paralegal met 6 jaar ervaring in juridische ondersteuning en documentbeheer. Gespecialiseerd in corporate law en contractenrecht. Gepassioneerd over precisie en juridische excellentie.',
    photoUrl: 'https://randomuser.me/api/portraits/women/37.jpg',
    contact: {
      email: 'maud.vanderlinden@email.nl',
      phone: '+31 6 76543210',
      location: 'Den Haag, Nederland'
    },
    experience: [
      {
        title: 'Senior Paralegal',
        company: 'Legal Partners Advocaten',
        location: 'Den Haag',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Juridische ondersteuning aan advocaten',
          'Documentbeheer en -onderzoek',
          'Contracten opstellen en beoordelen',
          'Begeleiding van M&A transacties'
        ]
      },
      {
        title: 'Paralegal',
        company: 'Corporate Law Firm',
        location: 'Amsterdam',
        dates: '2017 - 2020',
        achievements: [
          'Juridisch onderzoek en documentatie',
          'Administratieve ondersteuning',
          'Klantcommunicatie'
        ]
      }
    ],
    education: [
      {
        institution: 'Hogeschool Leiden',
        degree: 'Bachelor Rechtsgeleerdheid',
        field: 'Recht',
        dates: '2013 - 2017',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Juridisch onderzoek', 'Documentbeheer', 'Contractrecht', 'Legal software'],
      soft: ['Precisie', 'Analytisch denken', 'Communicatie', 'Organisatie']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)', 'Frans (Basis)'],
    hobbies: ['Lezen', 'Yoga', 'Wandelen', 'Muziek']
  },
  'legal-assistant': {
    template: 'modern',
    fullName: 'Rick van der Hoek',
    title: 'Juridisch Medewerker',
    summary: 'Proactieve juridisch medewerker met 5 jaar ervaring in juridische administratie en ondersteuning. Gespecialiseerd in documentbeheer en klantcommunicatie. Gepassioneerd over efficiëntie en service.',
    photoUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
    contact: {
      email: 'rick.vanderhoek@email.nl',
      phone: '+31 6 65432109',
      location: 'Amsterdam, Nederland'
    },
    experience: [
      {
        title: 'Juridisch Medewerker',
        company: 'Legal Services Amsterdam',
        location: 'Amsterdam',
        dates: '2020 - Heden',
        current: true,
        achievements: [
          'Juridische administratie en documentbeheer',
          'Klantcommunicatie en -ondersteuning',
          'Planning en agenda beheer',
          'Ondersteuning bij procedures'
        ]
      },
      {
        title: 'Administratief Medewerker',
        company: 'Law Office Den Haag',
        location: 'Den Haag',
        dates: '2018 - 2020',
        achievements: [
          'Administratieve ondersteuning',
          'Documentverwerking',
          'Telefoonbeantwoording'
        ]
      }
    ],
    education: [
      {
        institution: 'ROC Amsterdam',
        degree: 'MBO Juridisch Administratief',
        field: 'Recht',
        dates: '2015 - 2018',
        achievements: ['Diploma behaald']
      }
    ],
    skills: {
      technical: ['Microsoft Office', 'Legal software', 'Documentbeheer', 'Administratie'],
      soft: ['Organisatie', 'Communicatie', 'Precisie', 'Klantgerichtheid']
    },
    languages: ['Nederlands (Moedertaal)', 'Engels (Vloeiend)'],
    hobbies: ['Fitness', 'Lezen', 'Gaming', 'Muziek']
  }
};

async function addExampleCVsToAdmin() {
  const adminEmail = 'admin@admin.com';
  
  console.log('🔧 Adding example CVs to admin account...\n');
  
  try {
    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!adminUser) {
      console.error('❌ Admin user not found! Please run setup-admin-user.js first.');
      return;
    }
    
    console.log(`✅ Found admin user: ${adminUser.email} (ID: ${adminUser.id})\n`);
    
    // Delete existing CVs for admin (optional - to avoid duplicates)
    const existingCVs = await prisma.cV.count({
      where: { userId: adminUser.id }
    });
    
    if (existingCVs > 0) {
      console.log(`📋 Found ${existingCVs} existing CVs. Deleting to avoid duplicates...`);
      await prisma.cV.deleteMany({
        where: { userId: adminUser.id }
      });
      console.log('✅ Existing CVs deleted.\n');
    }
    
    // Add all example CVs
    console.log('📝 Adding example CVs...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const professionId of PROFESSION_IDS) {
      const cvData = EXAMPLE_CVS[professionId];
      
      if (!cvData) {
        console.log(`⚠️  No data found for profession: ${professionId}`);
        errorCount++;
        continue;
      }
      
      try {
        // Create a title based on the CV data
        const title = `${cvData.fullName} - ${cvData.title}`;
        
        await prisma.cV.create({
          data: {
            userId: adminUser.id,
            title: title,
            template: cvData.template || 'modern',
            content: JSON.stringify(cvData)
          }
        });
        
        console.log(`   ✅ Added: ${title}`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed to add ${professionId}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully added: ${successCount} CVs`);
    if (errorCount > 0) {
      console.log(`❌ Failed: ${errorCount} CVs`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Verify
    const totalCVs = await prisma.cV.count({
      where: { userId: adminUser.id }
    });
    
    console.log(`\n📊 Total CVs in admin account: ${totalCVs}`);
    console.log('\n🎉 Done! Login as admin@admin.com to see all example CVs in the dashboard.');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addExampleCVsToAdmin()
  .catch((error) => {
    console.error('Failed to add example CVs:', error);
    process.exit(1);
  });
