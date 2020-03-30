import { CommonModule } from '@angular/common';
import { Component, NgModule, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../app/material.module';
import { TitleService } from '../../services/title.service';
import { CommandService } from '../../services/command.service';
import { NavigationService } from '../../services/navigation.service';
import styles from './home.component.less';
import { Dictionary } from '../../models/types';

@Component({
	selector: 'h-home',
	template: require('./home.component.html'),
	changeDetection: ChangeDetectionStrategy.OnPush,
	styles: [styles]
})
export class HomeComponent implements OnDestroy {
	public readonly servers = this.api.getProxies();
	public serversForm: FormGroup;

	private readonly subscription: Subscription;

	constructor(
		private readonly titleService: TitleService,
		private readonly fb: FormBuilder,
		private readonly api: CommandService,
		private readonly navigation: NavigationService
	) {
		this.titleService.setTitle('Home');
		this.serversForm = this.fb.group({});

		this.subscription = this.servers.subscribe((servers) => {
			const group = servers.items.reduce<Dictionary<false>>((res, item) => {
				res[item.id] = false;
				return res;
			}, {});
			this.serversForm = this.fb.group(group);
		});
	}

	public ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	public showHostDetails(hostId: string): void {
		this.navigation.toHostDetails(hostId);
	}

	public toggleRun(): void {
		const selectionState: Dictionary<boolean> = this.serversForm.value;
		this.api.toggleService(selectionState).subscribe(() => {
			// TODO success
		});
	}
}

@NgModule({
	imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
	declarations: [HomeComponent],
	exports: [HomeComponent]
})
export class HomeComponentModule {}
