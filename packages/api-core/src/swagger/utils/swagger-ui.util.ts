import { SWAGGER_UI_CONSTANTS } from '../constants/swagger-ui.constants';

export type DocProvider = 'swagger' | 'redoc' | 'scalar' | 'all';

export interface SwaggerUIOptions {
  customSiteTitle?: string;
  topbarIconFilename?: string;
  faviconFilename?: string;
  persistAuthorization?: boolean;
  docProvider?: DocProvider;
  wavyGradient?: {
    enabled: boolean;
    colors: string[];
    height?: string;
    waveHeight?: string;
  };
}

export class SwaggerUI {
  private readonly applicationUrl: string;
  private readonly customSiteTitle: string;
  private readonly topbarIconFilename?: string;
  private readonly faviconFilename?: string;
  private readonly wavyGradient?: SwaggerUIOptions['wavyGradient'];

  constructor(applicationUrl: string, options: SwaggerUIOptions = {}) {
    this.applicationUrl = applicationUrl;
    this.customSiteTitle = options.customSiteTitle || 'API Documentation';
    this.topbarIconFilename = options.topbarIconFilename;
    this.faviconFilename = options.faviconFilename;
    this.wavyGradient = options.wavyGradient;
  }

  private get wavyGradientCss(): string {
    if (!this.wavyGradient?.enabled) return '';

    const colors = this.wavyGradient.colors.join(', ');
    const height = this.wavyGradient.height || '120px';
    const waveHeight = this.wavyGradient.waveHeight || '20px';

    return `
      .swagger-ui .topbar {
        background: linear-gradient(135deg, ${colors}) !important;
        height: ${height} !important;
        position: relative !important;
        overflow: hidden !important;
      }
      .swagger-ui .topbar::after {
        content: '';
        position: absolute;
        bottom: -${waveHeight};
        left: 0;
        width: 100%;
        height: ${waveHeight};
        background: linear-gradient(135deg, ${colors});
        clip-path: polygon(0 0, 100% 0, 100% 50%, 0 100%);
      }
      .swagger-ui .topbar .download-url-wrapper {
        padding-top: 20px !important;
      }
    `;
  }

  private get customCss(): string {
    const topbarIcon = this.topbarIconFilename
      ? `content:url('${this.applicationUrl}/static/swagger/assets/${this.topbarIconFilename}'); width:auto; height:52px;`
      : '';

    const baseTopbarColor = this.wavyGradient?.enabled 
      ? '' 
      : `.swagger-ui .topbar { background-color: ${SWAGGER_UI_CONSTANTS.TOPBAR.BACKGROUND_COLOR}; }`;

    return `
      ${this.wavyGradientCss}
      .topbar-wrapper { ${topbarIcon} }
      .topbar-wrapper svg { visibility: hidden; }
      ${baseTopbarColor}
      .swagger-ui .opblock.opblock-get { 
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BACKGROUND_COLOR}; 
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.BORDER_COLOR}; 
      }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { 
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.GET.SUMMARY_COLOR}; 
      }
      .swagger-ui .opblock.opblock-post { 
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BACKGROUND_COLOR}; 
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.BORDER_COLOR}; 
      }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { 
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.POST.SUMMARY_COLOR}; 
      }
      .swagger-ui .opblock.opblock-delete { 
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BACKGROUND_COLOR}; 
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.BORDER_COLOR}; 
      }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { 
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.DELETE.SUMMARY_COLOR}; 
      }
      .swagger-ui .opblock.opblock-patch { 
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BACKGROUND_COLOR}; 
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.BORDER_COLOR}; 
      }
      .swagger-ui .opblock.opblock-patch .opblock-summary-method { 
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PATCH.SUMMARY_COLOR}; 
      }
      .swagger-ui .opblock.opblock-put { 
        background-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BACKGROUND_COLOR}; 
        border-color: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.BORDER_COLOR}; 
      }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { 
        background: ${SWAGGER_UI_CONSTANTS.HTTP_METHODS.PUT.SUMMARY_COLOR}; 
      }
      .swagger-ui .btn.authorize { 
        border-color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; 
        color: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; 
      }
      .swagger-ui .btn.authorize svg { 
        fill: ${SWAGGER_UI_CONSTANTS.AUTHORIZE.BACKGROUND_COLOR}; 
      }
    `;
  }

  private get customfavIcon(): string | undefined {
    return this.faviconFilename
      ? `${this.applicationUrl}/static/swagger/assets/${this.faviconFilename}`
      : undefined;
  }

  public get customOptions() {
    const options: any = {
      customSiteTitle: this.customSiteTitle,
      customCss: this.customCss,
      swaggerOptions: {
        persistAuthorization: true,
      },
    };

    if (this.customfavIcon) {
      options.customfavIcon = this.customfavIcon;
    }

    return options;
  }
}
