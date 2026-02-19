import type { JobsWidgetConfig, Job, WidgetState, FilterState } from './types';
import { fetchJobs } from './api';
import { renderFilters, applyFilters } from './components/Filters';
import { renderJobList } from './components/JobList';
import { renderJobDetail } from './components/JobDetail';
import { renderEmptyState } from './components/EmptyState';
import { openApplyModal } from './components/ApplyModal';
import { injectJsonLd } from './components/JsonLd';
import styles from './styles.css?inline';

// Google Fonts URLs for each template
const TEMPLATE_FONTS: Record<string, string> = {
  simple: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  swiss: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap',
  terminal: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
  'saas-gradient': 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
  editorial: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;700&family=Inter:wght@400;500;600&display=swap',
  glassdoor: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap',
  'compact-table': 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap',
  department: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'two-panel': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  'vibrant-bento': 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
};

// Templates that use 'list' layout in the widget
const TEMPLATE_LAYOUTS: Record<string, 'cards' | 'list'> = {
  simple: 'cards',
  swiss: 'list',
  terminal: 'list',
  'saas-gradient': 'cards',
  editorial: 'list',
  glassdoor: 'cards',
  'compact-table': 'list',
  department: 'list',
  'two-panel': 'list',
  'vibrant-bento': 'cards',
};

class HireKitJobs {
  private shadowRoot: ShadowRoot | null = null;
  private root: HTMLElement | null = null;
  private config: JobsWidgetConfig | null = null;

  private state: WidgetState = {
    jobs: [],
    filteredJobs: [],
    company: null,
    filters: { search: '', department: '', location: '', type: '' },
    view: 'list',
    selectedJob: null,
    loading: true,
    error: null,
  };

  async init(config: JobsWidgetConfig): Promise<void> {
    this.config = config;

    const container = document.getElementById(config.containerId || 'hirekit-jobs');
    if (!container) {
      console.error(`HireKitJobs: Container #${config.containerId || 'hirekit-jobs'} not found`);
      return;
    }

    // Shadow DOM setup
    this.shadowRoot = container.attachShadow({ mode: 'open' });

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);
    this.shadowRoot.adoptedStyleSheets = [styleSheet];

    // Apply theme class (legacy support)
    if (config.theme === 'dark') {
      (this.shadowRoot as any).host.classList.add('hk-dark');
    }

    // Apply template class if provided directly
    if (config.template) {
      this.applyTemplate(config.template);
    }

    // Apply custom primary color
    if (config.primaryColor) {
      (this.shadowRoot as any).host.style.setProperty('--hk-primary', config.primaryColor);
    }

    this.root = document.createElement('div');
    this.root.className = 'hk-jobs-root';
    this.shadowRoot.appendChild(this.root);

    this.render();

    try {
      const data = await fetchJobs(config.companyId);
      this.state.company = data.company;
      this.state.jobs = data.jobs;
      this.state.filteredJobs = data.jobs;
      this.state.loading = false;

      // Apply template from API if not overridden in config
      if (!config.template && data.jobListingConfig?.templateId) {
        this.applyTemplate(data.jobListingConfig.templateId, {
          customCSS: data.jobListingConfig.customCSS,
          customFontUrl: data.jobListingConfig.customFontUrl,
          customLayout: data.jobListingConfig.customLayout,
        });
      }

      // Apply showFilters/showSearch from API if not set in config
      if (config.showFilters === undefined && data.jobListingConfig) {
        this.config = { ...this.config, showFilters: data.jobListingConfig.showFilters };
      }
      if (config.showSearch === undefined && data.jobListingConfig) {
        this.config = { ...this.config, showSearch: data.jobListingConfig.showSearch };
      }

      // Use company's primary color if not overridden
      if (!config.primaryColor && data.company.primaryColor) {
        (this.shadowRoot as any).host.style.setProperty(
          '--hk-primary',
          data.company.primaryColor
        );
      }

      // Inject JSON-LD for SEO
      injectJsonLd(data.jobs, data.company);

      this.render();
    } catch (err) {
      console.error('HireKitJobs: Failed to load jobs', err);
      this.state.loading = false;
      this.state.error = 'Failed to load job listings. Please try again later.';
      this.render();
    }
  }

  private applyTemplate(templateId: string, customData?: { customCSS?: string; customFontUrl?: string; customLayout?: 'cards' | 'list' }): void {
    if (!this.shadowRoot) return;
    const host = (this.shadowRoot as any).host as HTMLElement;

    // Remove any existing template classes
    const classes = Array.from(host.classList);
    classes.forEach(cls => {
      if (cls.startsWith('hk-tpl-')) host.classList.remove(cls);
    });

    // Handle custom template
    if (templateId === 'custom' && customData?.customCSS) {
      host.classList.add('hk-tpl-custom');

      // Inject custom CSS into Shadow DOM via adoptedStyleSheets
      try {
        const customSheet = new CSSStyleSheet();
        customSheet.replaceSync(customData.customCSS);
        const existing = this.shadowRoot.adoptedStyleSheets;
        // Append custom sheet (don't replace base styles)
        this.shadowRoot.adoptedStyleSheets = [...existing.filter(s => !(s as any).__hkCustom), customSheet];
        (customSheet as any).__hkCustom = true;
      } catch (e) {
        console.warn('HireKitJobs: Failed to apply custom CSS', e);
      }

      // Inject custom Google Font
      if (customData.customFontUrl) {
        const existingLink = document.querySelector('link[data-hirekit-font="custom"]');
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = customData.customFontUrl;
          link.setAttribute('data-hirekit-font', 'custom');
          document.head.appendChild(link);
        }
      }

      // Set layout from custom data
      if (!this.config?.layout && customData.customLayout && this.config) {
        this.config = { ...this.config, layout: customData.customLayout };
      }
      return;
    }

    // Apply the template class (skip 'simple' since it uses defaults)
    if (templateId !== 'simple') {
      host.classList.add(`hk-tpl-${templateId}`);
    }

    // Inject Google Fonts
    const fontUrl = TEMPLATE_FONTS[templateId];
    if (fontUrl) {
      // Inject into document head (fonts don't load from Shadow DOM)
      const existingLink = document.querySelector(`link[data-hirekit-font="${templateId}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.setAttribute('data-hirekit-font', templateId);
        document.head.appendChild(link);
      }
    }

    // Update layout based on template
    if (!this.config?.layout) {
      const templateLayout = TEMPLATE_LAYOUTS[templateId];
      if (templateLayout && this.config) {
        this.config = { ...this.config, layout: templateLayout };
      }
    }
  }

  private render(): void {
    if (!this.root || !this.config) return;
    this.root.innerHTML = '';

    if (this.state.loading) {
      this.root.innerHTML = '<div class="hk-loading"><div class="hk-spinner"></div></div>';
      return;
    }

    if (this.state.error) {
      this.root.innerHTML = `<div class="hk-error">${this.state.error}</div>`;
      return;
    }

    // Header
    if (this.state.company) {
      const header = document.createElement('div');
      header.className = 'hk-header';
      if (this.state.company.logo) {
        header.innerHTML += `<img class="hk-header-logo" src="${this.state.company.logo}" alt="${this.state.company.name}" />`;
      }
      header.innerHTML += `<span class="hk-header-title">Careers at ${this.state.company.name}</span>`;
      header.innerHTML += `<span class="hk-header-count">${this.state.filteredJobs.length} open position${this.state.filteredJobs.length !== 1 ? 's' : ''}</span>`;
      this.root.appendChild(header);
    }

    // Detail view
    if (this.state.view === 'detail' && this.state.selectedJob) {
      this.root.appendChild(
        renderJobDetail(
          this.state.selectedJob,
          () => {
            this.state.view = 'list';
            this.state.selectedJob = null;
            this.render();
          },
          (job) => this.handleApply(job)
        )
      );
      return;
    }

    // Filters
    const showFilters = this.config.showFilters !== false && this.state.jobs.length > 3;
    const showSearch = this.config.showSearch !== false;
    if (showFilters || showSearch) {
      this.root.appendChild(
        renderFilters(
          this.state.jobs,
          this.state.filters,
          showSearch,
          (filters) => this.handleFilterChange(filters)
        )
      );
    }

    // Job list or empty state
    if (this.state.filteredJobs.length === 0) {
      const hasActiveFilters = !!(
        this.state.filters.search ||
        this.state.filters.department ||
        this.state.filters.location ||
        this.state.filters.type
      );
      this.root.appendChild(renderEmptyState(hasActiveFilters));
    } else {
      const layout = this.config.layout || 'cards';
      this.root.appendChild(
        renderJobList(
          this.state.filteredJobs,
          layout,
          (job) => {
            this.state.view = 'detail';
            this.state.selectedJob = job;
            this.render();
          },
          (job) => this.handleApply(job)
        )
      );
    }
  }

  private handleFilterChange(filters: FilterState): void {
    this.state.filters = filters;
    this.state.filteredJobs = applyFilters(this.state.jobs, filters);
    this.render();
  }

  private handleApply(job: Job): void {
    if (!this.shadowRoot || !this.config) return;
    openApplyModal(job, this.config.companyId, this.shadowRoot);
  }

  destroy(): void {
    // Remove JSON-LD
    const jsonLd = document.querySelector('script[data-hirekit-jobs-jsonld]');
    if (jsonLd) jsonLd.remove();

    this.root = null;
    this.shadowRoot = null;
    this.config = null;
  }
}

if (typeof window !== 'undefined') {
  (window as any).HireKitJobs = new HireKitJobs();
}
