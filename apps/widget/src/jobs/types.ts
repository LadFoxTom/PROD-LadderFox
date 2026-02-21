export interface JobsWidgetConfig {
  companyId: string;
  containerId?: string;
  template?: string;
  layout?: 'cards' | 'list';
  theme?: 'light' | 'dark';
  primaryColor?: string;
  showFilters?: boolean;
  showSearch?: boolean;
}

export interface JobListingConfigResponse {
  templateId: string;
  showFilters: boolean;
  showSearch: boolean;
  customCSS?: string;
  customFontUrl?: string;
  customLayout?: 'cards' | 'list';
}

export interface Job {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  benefitTags: string[];
  location: string | null;
  type: string | null;
  workplaceType: string | null;
  employmentTypes: string[];
  experienceLevel: string | null;
  department: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  salaryPeriod: string | null;
  showSalary: boolean;
  createdAt: string;
}

export interface CompanyInfo {
  name: string;
  logo: string | null;
  primaryColor: string;
}

export interface JobsApiResponse {
  company: CompanyInfo;
  jobListingConfig?: JobListingConfigResponse;
  jobs: Job[];
}

export interface FilterState {
  search: string;
  department: string;
  location: string;
  type: string;
}

export type View = 'list' | 'detail';

export interface WidgetState {
  jobs: Job[];
  filteredJobs: Job[];
  company: CompanyInfo | null;
  filters: FilterState;
  view: View;
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
}
