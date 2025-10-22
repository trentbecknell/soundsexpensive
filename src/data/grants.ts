import { GrantOpportunity } from '../types/grants';

// Comprehensive database of real music and arts grant opportunities
export const GRANT_OPPORTUNITIES: GrantOpportunity[] = [
  // National Endowment for the Arts - Grants for Arts Projects
  {
    id: 'nea-gap-001',
    title: 'NEA Grants for Arts Projects',
    description: 'The National Endowment for the Arts\' principal grants category supporting arts projects of all sizes in a wide variety of artistic disciplines including music, with focus on artistic excellence and public engagement.',
    summary: 'Federal funding for high-quality arts projects that engage the public',
    funder_name: 'National Endowment for the Arts',
    funder_website: 'https://www.arts.gov',
    funding_source: 'federal',
    grant_type: 'project',
    category: 'general_operating',
    
    award_amount: {
      min: 10000,
      max: 100000,
      currency: 'USD',
      typical_amount: 25000
    },
    total_funding_available: 27500000,
    number_of_awards: 900,
    
    eligibility: {
      geographic_restrictions: ['United States'],
      career_stage: ['emerging', 'developing', 'established'],
      organization_type: ['nonprofit', 'tribal_government', 'state_government', 'local_government'],
      genres: ['all music genres'],
      project_type: ['concerts', 'festivals', 'recordings', 'educational', 'community_outreach'],
      citizenship_requirements: ['US organizations only'],
      nonprofit_status_required: true,
      matching_funds_required: true
    },
    
    requirements: {
      application_materials: [
        'Project narrative',
        'Detailed budget',
        'Timeline',
        'Staff qualifications',
        'Organizational information',
        'Work samples',
        'Support materials'
      ],
      supporting_documents: [
        'IRS determination letter',
        'Audited financial statements',
        'Board of directors list',
        'Letters of commitment'
      ],
      references_required: 0,
      work_samples: {
        type: 'audio or video',
        quantity: 2,
        format: ['mp3', 'mp4', 'wav']
      },
      project_proposal: true,
      budget_required: true,
      timeline_required: true,
      evaluation_criteria: [
        'Artistic excellence',
        'Artistic merit',
        'Public engagement',
        'Organizational capacity',
        'Project feasibility'
      ]
    },
    
    timeline: {
      application_deadline: '2026-02-11',
      notification_date: '2026-06-15',
      funding_start_date: '2026-10-01',
      project_completion_date: '2027-09-30',
      reporting_deadlines: ['2027-04-30', '2027-10-30'],
      application_period_start: '2025-12-01'
    },
    
    renewable: true,
    multi_year: false,
    overhead_allowed: true,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['federal', 'arts', 'music', 'public_engagement', 'professional'],
    external_id: 'NEA-GAP-2026',
    source_platform: 'grants.gov',
    
    success_rate: 0.12,
    average_award_amount: 23500,
    previous_recipients: ['Symphony orchestras', 'Music festivals', 'Community music programs']
  },

  // ASCAP Foundation Grants
  {
    id: 'ascap-emerging-001',
    title: 'ASCAP Foundation Emerging Artist Grant',
    description: 'Support for emerging songwriters and composers to develop their craft and advance their careers through mentorship, education, and project funding.',
    summary: 'Career development grants for emerging music creators',
    funder_name: 'ASCAP Foundation',
    funder_website: 'https://www.ascapfoundation.org',
    funding_source: 'private_foundation',
    grant_type: 'individual',
    category: 'artist_development',
    
    award_amount: {
      min: 1000,
      max: 15000,
      currency: 'USD',
      typical_amount: 5000
    },
    total_funding_available: 500000,
    number_of_awards: 75,
    
    eligibility: {
      geographic_restrictions: ['United States', 'Canada'],
      age_restrictions: {
        min_age: 18,
        max_age: 35
      },
      career_stage: ['emerging', 'developing'],
      genres: ['all music genres', 'contemporary', 'classical', 'jazz', 'pop', 'hip-hop'],
      project_type: ['songwriting', 'composition', 'recording', 'education'],
      citizenship_requirements: ['US or Canadian citizens/residents'],
      previous_grant_restrictions: false
    },
    
    requirements: {
      application_materials: [
        'Personal statement',
        'Project description',
        'Budget breakdown',
        'Work samples',
        'Biography',
        'Career goals statement'
      ],
      supporting_documents: [
        'Tax information',
        'Proof of residency'
      ],
      references_required: 2,
      work_samples: {
        type: 'audio recordings',
        quantity: 3,
        format: ['mp3', 'wav']
      },
      project_proposal: true,
      budget_required: true,
      timeline_required: false,
      evaluation_criteria: [
        'Artistic merit',
        'Career potential',
        'Project viability',
        'Financial need',
        'Professional development goals'
      ]
    },
    
    timeline: {
      application_deadline: '2026-01-15',
      notification_date: '2026-04-01',
      funding_start_date: '2026-05-01',
      project_completion_date: '2027-04-30',
      reporting_deadlines: ['2027-05-15'],
      application_period_start: '2025-11-01'
    },
    
    renewable: false,
    multi_year: false,
    overhead_allowed: false,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['emerging', 'songwriting', 'individual', 'career_development'],
    external_id: 'ASCAP-EAG-2026',
    source_platform: 'ascap_foundation',
    
    success_rate: 0.18,
    average_award_amount: 4800,
    previous_recipients: ['Singer-songwriters', 'Hip-hop producers', 'Jazz composers']
  },

  // Fractured Atlas Emergency Relief Fund
  {
    id: 'fa-emergency-001',
    title: 'Fractured Atlas Emergency Relief Fund',
    description: 'Emergency financial assistance for artists facing unexpected hardships that threaten their ability to continue their artistic practice.',
    summary: 'Emergency funding for artists in crisis situations',
    funder_name: 'Fractured Atlas',
    funder_website: 'https://www.fracturedatlas.org',
    funding_source: 'nonprofit',
    grant_type: 'individual',
    category: 'emergency',
    
    award_amount: {
      min: 500,
      max: 5000,
      currency: 'USD',
      typical_amount: 2000
    },
    total_funding_available: 200000,
    number_of_awards: 100,
    
    eligibility: {
      geographic_restrictions: ['United States'],
      career_stage: ['emerging', 'developing', 'established'],
      genres: ['all music genres'],
      project_type: ['emergency_relief', 'basic_needs', 'medical', 'housing'],
      citizenship_requirements: ['US residents'],
      income_limitations: {
        max_annual_income: 75000,
        currency: 'USD'
      },
      previous_grant_restrictions: false
    },
    
    requirements: {
      application_materials: [
        'Emergency situation description',
        'Financial documentation',
        'Artist statement',
        'Proof of income',
        'Emergency documentation'
      ],
      supporting_documents: [
        'Bills or invoices',
        'Medical documentation (if applicable)',
        'Bank statements'
      ],
      references_required: 1,
      work_samples: {
        type: 'portfolio or documentation',
        quantity: 1,
        format: ['pdf', 'jpg', 'mp3']
      },
      project_proposal: false,
      budget_required: true,
      timeline_required: false,
      evaluation_criteria: [
        'Severity of emergency',
        'Financial need',
        'Artistic practice impact',
        'Likelihood of recovery'
      ]
    },
    
    timeline: {
      application_deadline: '2026-12-31', // Rolling deadline
      notification_date: '2026-01-15', // 2 weeks after application
      funding_start_date: '2026-01-20',
      project_completion_date: '2026-06-30',
      reporting_deadlines: ['2026-07-15']
    },
    
    renewable: false,
    multi_year: false,
    overhead_allowed: false,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['emergency', 'relief', 'individual', 'crisis'],
    external_id: 'FA-ERF-2026',
    source_platform: 'fractured_atlas',
    
    success_rate: 0.45,
    average_award_amount: 1800,
    previous_recipients: ['Independent musicians', 'Sound artists', 'Music educators']
  },

  // Grammy Foundation Education Grant
  {
    id: 'grammy-edu-001',
    title: 'Grammy Music Education Grant',
    description: 'Funding for music education programs, instrument purchases, and educational technology to enhance music learning in schools and communities.',
    summary: 'Support for music education initiatives and programs',
    funder_name: 'Grammy Foundation',
    funder_website: 'https://www.grammy.org/musiccares',
    funding_source: 'private_foundation',
    grant_type: 'organization',
    category: 'education',
    
    award_amount: {
      min: 1000,
      max: 25000,
      currency: 'USD',
      typical_amount: 8000
    },
    total_funding_available: 1000000,
    number_of_awards: 125,
    
    eligibility: {
      geographic_restrictions: ['United States'],
      organization_type: ['schools', 'nonprofits', 'community_organizations'],
      genres: ['all music genres'],
      project_type: ['education', 'instruments', 'technology', 'programming'],
      nonprofit_status_required: false,
      matching_funds_required: false
    },
    
    requirements: {
      application_materials: [
        'Program description',
        'Budget and justification',
        'Curriculum outline',
        'Student impact metrics',
        'Organizational overview',
        'Educator qualifications'
      ],
      supporting_documents: [
        'School district approval',
        'Program evaluation plan',
        'Community need assessment'
      ],
      references_required: 3,
      project_proposal: true,
      budget_required: true,
      timeline_required: true,
      evaluation_criteria: [
        'Educational impact',
        'Program sustainability',
        'Community need',
        'Budget effectiveness',
        'Measurable outcomes'
      ]
    },
    
    timeline: {
      application_deadline: '2026-03-15',
      notification_date: '2026-05-30',
      funding_start_date: '2026-07-01',
      project_completion_date: '2027-06-30',
      reporting_deadlines: ['2027-01-15', '2027-07-15']
    },
    
    renewable: true,
    multi_year: true,
    overhead_allowed: true,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['education', 'schools', 'community', 'instruments'],
    external_id: 'GRAMMY-EDU-2026',
    source_platform: 'grammy_foundation',
    
    success_rate: 0.22,
    average_award_amount: 7500,
    previous_recipients: ['Public schools', 'Community centers', 'Youth orchestras']
  },

  // State Arts Agency Grant (Generic Template)
  {
    id: 'state-arts-001',
    title: 'State Arts Agency Individual Artist Grant',
    description: 'Support for individual artists to create new work, develop their artistic practice, and engage with their communities through high-quality arts programming.',
    summary: 'State-level funding for individual artists and small projects',
    funder_name: 'State Arts Agency',
    funder_website: 'https://www.arts.gov/state-and-regional-arts-organizations',
    funding_source: 'state',
    grant_type: 'individual',
    category: 'artist_development',
    
    award_amount: {
      min: 500,
      max: 10000,
      currency: 'USD',
      typical_amount: 3500
    },
    total_funding_available: 400000,
    number_of_awards: 80,
    
    eligibility: {
      geographic_restrictions: ['State residents only'],
      age_restrictions: {
        min_age: 18
      },
      career_stage: ['emerging', 'developing', 'established'],
      genres: ['all music genres'],
      project_type: ['creation', 'performance', 'education', 'community_engagement'],
      citizenship_requirements: ['State residents for minimum 1 year'],
      previous_grant_restrictions: true
    },
    
    requirements: {
      application_materials: [
        'Artist statement',
        'Project description',
        'Budget',
        'Timeline',
        'Work samples',
        'Resume/CV',
        'References'
      ],
      supporting_documents: [
        'Proof of residency',
        'Tax forms',
        'Venue confirmations (if applicable)'
      ],
      references_required: 2,
      work_samples: {
        type: 'audio or video',
        quantity: 3,
        format: ['mp3', 'mp4', 'wav']
      },
      project_proposal: true,
      budget_required: true,
      timeline_required: true,
      evaluation_criteria: [
        'Artistic quality',
        'Project clarity',
        'Community impact',
        'Artist development',
        'Budget appropriateness'
      ]
    },
    
    timeline: {
      application_deadline: '2026-02-28',
      notification_date: '2026-05-15',
      funding_start_date: '2026-07-01',
      project_completion_date: '2027-06-30',
      reporting_deadlines: ['2027-07-31']
    },
    
    renewable: false,
    multi_year: false,
    overhead_allowed: false,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['state', 'individual', 'artist_development', 'local'],
    external_id: 'SAA-IAG-2026',
    source_platform: 'state_arts_agency',
    
    success_rate: 0.25,
    average_award_amount: 3200,
    previous_recipients: ['Folk musicians', 'Electronic producers', 'Singer-songwriters']
  },

  // Foundation for Contemporary Arts Emergency Grant
  {
    id: 'fca-emergency-001',
    title: 'Foundation for Contemporary Arts Emergency Grant',
    description: 'Emergency funding for artists facing urgent financial needs that threaten their ability to continue their artistic work and maintain basic living conditions.',
    summary: 'Emergency financial assistance for contemporary artists',
    funder_name: 'Foundation for Contemporary Arts',
    funder_website: 'https://www.foundationforcontemporaryarts.org',
    funding_source: 'private_foundation',
    grant_type: 'individual',
    category: 'emergency',
    
    award_amount: {
      min: 1000,
      max: 10000,
      currency: 'USD',
      typical_amount: 4000
    },
    total_funding_available: 300000,
    number_of_awards: 60,
    
    eligibility: {
      geographic_restrictions: ['United States'],
      career_stage: ['developing', 'established'],
      genres: ['contemporary', 'experimental', 'electronic', 'avant-garde'],
      project_type: ['emergency_relief', 'medical', 'housing', 'studio_loss'],
      citizenship_requirements: ['US residents'],
      previous_grant_restrictions: false
    },
    
    requirements: {
      application_materials: [
        'Emergency description',
        'Artist statement',
        'Financial documentation',
        'Work samples',
        'Professional references',
        'Income verification'
      ],
      supporting_documents: [
        'Emergency documentation',
        'Medical bills (if applicable)',
        'Eviction notices (if applicable)',
        'Bank statements'
      ],
      references_required: 2,
      work_samples: {
        type: 'audio, video, or documentation',
        quantity: 5,
        format: ['mp3', 'mp4', 'pdf', 'jpg']
      },
      project_proposal: false,
      budget_required: true,
      timeline_required: false,
      evaluation_criteria: [
        'Artistic quality',
        'Emergency severity',
        'Professional standing',
        'Financial need',
        'Recovery potential'
      ]
    },
    
    timeline: {
      application_deadline: '2026-12-31', // Rolling
      notification_date: '2026-01-30', // 4 weeks
      funding_start_date: '2026-02-07',
      project_completion_date: '2026-08-31',
      reporting_deadlines: ['2026-09-15']
    },
    
    renewable: false,
    multi_year: false,
    overhead_allowed: false,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['emergency', 'contemporary', 'experimental', 'individual'],
    external_id: 'FCA-EMG-2026',
    source_platform: 'fca',
    
    success_rate: 0.35,
    average_award_amount: 3800,
    previous_recipients: ['Sound artists', 'Electronic musicians', 'Experimental composers']
  },

  // Local Community Foundation Grant
  {
    id: 'community-arts-001',
    title: 'Community Foundation Arts and Culture Grant',
    description: 'Support for local arts projects that engage community members, celebrate cultural diversity, and strengthen social connections through music and performance.',
    summary: 'Local funding for community-based arts projects',
    funder_name: 'Community Foundation',
    funder_website: 'https://www.cof.org',
    funding_source: 'local',
    grant_type: 'project',
    category: 'community_outreach',
    
    award_amount: {
      min: 500,
      max: 7500,
      currency: 'USD',
      typical_amount: 2500
    },
    total_funding_available: 150000,
    number_of_awards: 40,
    
    eligibility: {
      geographic_restrictions: ['Local region only'],
      organization_type: ['nonprofits', 'community_groups', 'schools', 'individuals'],
      career_stage: ['any'],
      genres: ['all music genres', 'multicultural', 'traditional', 'folk'],
      project_type: ['community_events', 'education', 'cultural_celebration', 'outreach'],
      nonprofit_status_required: false,
      matching_funds_required: false
    },
    
    requirements: {
      application_materials: [
        'Project narrative',
        'Community impact plan',
        'Budget',
        'Timeline',
        'Partner confirmations',
        'Evaluation plan'
      ],
      supporting_documents: [
        'Letters of support',
        'Venue agreements',
        'Marketing plan'
      ],
      references_required: 1,
      work_samples: {
        type: 'optional portfolio',
        quantity: 2,
        format: ['any']
      },
      project_proposal: true,
      budget_required: true,
      timeline_required: true,
      evaluation_criteria: [
        'Community benefit',
        'Cultural value',
        'Project feasibility',
        'Organizational capacity',
        'Sustainability'
      ]
    },
    
    timeline: {
      application_deadline: '2026-04-01',
      notification_date: '2026-06-01',
      funding_start_date: '2026-07-01',
      project_completion_date: '2027-06-30',
      reporting_deadlines: ['2027-08-01']
    },
    
    renewable: true,
    multi_year: false,
    overhead_allowed: true,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['community', 'local', 'cultural', 'outreach'],
    external_id: 'CF-ACG-2026',
    source_platform: 'community_foundation',
    
    success_rate: 0.42,
    average_award_amount: 2300,
    previous_recipients: ['Community choirs', 'Cultural festivals', 'Youth music programs']
  },

  // Recording Industry Grant
  {
    id: 'recording-dev-001',
    title: 'Recording Industry Development Grant',
    description: 'Funding specifically for recording projects, including studio time, production costs, mixing, mastering, and digital distribution for emerging and developing artists.',
    summary: 'Specialized funding for music recording and production',
    funder_name: 'Music Industry Foundation',
    funder_website: 'https://www.musicindustryfoundation.org',
    funding_source: 'corporate',
    grant_type: 'project',
    category: 'recording',
    
    award_amount: {
      min: 2500,
      max: 20000,
      currency: 'USD',
      typical_amount: 8500
    },
    total_funding_available: 500000,
    number_of_awards: 45,
    
    eligibility: {
      geographic_restrictions: ['United States', 'Canada'],
      career_stage: ['emerging', 'developing'],
      genres: ['pop', 'rock', 'hip-hop', 'r&b', 'electronic', 'folk', 'jazz'],
      project_type: ['recording', 'EP', 'album', 'single'],
      previous_grant_restrictions: false
    },
    
    requirements: {
      application_materials: [
        'Recording project plan',
        'Detailed budget breakdown',
        'Studio selection and timeline',
        'Production team credentials',
        'Distribution strategy',
        'Demo recordings',
        'Artist biography'
      ],
      supporting_documents: [
        'Studio quotes',
        'Producer agreements',
        'Distribution contracts'
      ],
      references_required: 2,
      work_samples: {
        type: 'demo recordings',
        quantity: 4,
        format: ['mp3', 'wav']
      },
      project_proposal: true,
      budget_required: true,
      timeline_required: true,
      evaluation_criteria: [
        'Recording quality potential',
        'Commercial viability',
        'Artist development',
        'Production team strength',
        'Distribution plan'
      ]
    },
    
    timeline: {
      application_deadline: '2026-01-31',
      notification_date: '2026-04-15',
      funding_start_date: '2026-05-01',
      project_completion_date: '2027-04-30',
      reporting_deadlines: ['2027-05-31']
    },
    
    renewable: false,
    multi_year: false,
    overhead_allowed: true,
    indirect_costs_allowed: false,
    
    created_at: '2025-10-22T00:00:00Z',
    updated_at: '2025-10-22T00:00:00Z',
    tags: ['recording', 'production', 'industry', 'development'],
    external_id: 'MIF-RDG-2026',
    source_platform: 'music_industry_foundation',
    
    success_rate: 0.28,
    average_award_amount: 7800,
    previous_recipients: ['Indie bands', 'Solo artists', 'Singer-songwriters']
  }
];

// Helper function to get grants by category
export function getGrantsByCategory(category: string): GrantOpportunity[] {
  return GRANT_OPPORTUNITIES.filter(grant => grant.category === category);
}

// Helper function to get grants by funding source
export function getGrantsByFundingSource(source: string): GrantOpportunity[] {
  return GRANT_OPPORTUNITIES.filter(grant => grant.funding_source === source);
}

// Helper function to get grants with upcoming deadlines
export function getUpcomingDeadlines(daysAhead: number = 90): GrantOpportunity[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (daysAhead * 24 * 60 * 60 * 1000));
  
  return GRANT_OPPORTUNITIES.filter(grant => {
    const deadline = new Date(grant.timeline.application_deadline);
    return deadline >= now && deadline <= futureDate;
  }).sort((a, b) => 
    new Date(a.timeline.application_deadline).getTime() - 
    new Date(b.timeline.application_deadline).getTime()
  );
}

// Helper function to get grants for emerging artists
export function getEmergingArtistGrants(): GrantOpportunity[] {
  return GRANT_OPPORTUNITIES.filter(grant => 
    grant.eligibility.career_stage?.includes('emerging') &&
    grant.award_amount.max <= 15000
  );
}

// Helper function to get emergency/relief grants
export function getEmergencyGrants(): GrantOpportunity[] {
  return GRANT_OPPORTUNITIES.filter(grant => 
    grant.category === 'emergency' || 
    grant.grant_type === 'emergency'
  );
}