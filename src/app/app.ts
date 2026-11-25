import {
  Component,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  EnvironmentInjector,
  NgModuleRef,
  createNgModule,
  OnDestroy,
} from '@angular/core';

import { loadRemoteModule } from '@angular-architects/module-federation';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild('mfe1Container', { read: ViewContainerRef })
  mfe1Container!: ViewContainerRef;

  @ViewChild('mfe2Container', { read: ViewContainerRef })
  mfe2Container!: ViewContainerRef;

  private mfe2ModuleRef?: NgModuleRef<unknown>;

  private mfe1ModuleRef?: NgModuleRef<unknown>;
  private destroyed = false;

  constructor(private injector: EnvironmentInjector) {}

  ngAfterViewInit() {
    this.loadMfe1();
    this.loadMfe2();
  }

  private async loadMfe1(): Promise<void> {
    try {
      const [moduleExports, componentExports] = await Promise.all([
        loadRemoteModule({
          type: 'module',
          remoteEntry: environment.mfe1Url,
          exposedModule: './Module',
        }),
        loadRemoteModule({
          type: 'module',
          remoteEntry: environment.mfe1Url,
          exposedModule: './Component',
        }),
      ]);

      const moduleRef = createNgModule(moduleExports.Mfe1HomeModule, this.injector);

      if (this.destroyed) {
        moduleRef.destroy();
        return;
      }

      this.mfe1ModuleRef = moduleRef;

      this.mfe1Container.clear();

      this.mfe1Container.createComponent(componentExports.Mfe1Home, {
        ngModuleRef: moduleRef,
      });

      console.log('MFE-1 rendered successfully');
    } catch (error) {
      console.error('Failed to render MFE-1:', error);
    }
  }

  private async loadMfe2(): Promise<void> {
    try {
      const [moduleExports, componentExports] = await Promise.all([
        loadRemoteModule({
          type: 'module',
          remoteEntry: environment.mfe2Url,
          exposedModule: './Module',
        }),
        loadRemoteModule({
          type: 'module',
          remoteEntry: environment.mfe2Url,
          exposedModule: './Component',
        }),
      ]);

      const moduleRef = createNgModule(moduleExports.Mfe2HomeModule, this.injector);

      if (this.destroyed) {
        moduleRef.destroy();
        return;
      }

      this.mfe2ModuleRef = moduleRef;

      this.mfe2Container.clear();

      this.mfe2Container.createComponent(componentExports.Mfe2Home, {
        ngModuleRef: moduleRef,
      });

      console.log('MFE-2 rendered successfully');
    } catch (error) {
      console.error('Failed to load MFE-2:', error);
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;

    this.mfe1Container?.clear();
    this.mfe2Container?.clear();

    this.mfe1ModuleRef?.destroy();
    this.mfe2ModuleRef?.destroy();
  }
}
