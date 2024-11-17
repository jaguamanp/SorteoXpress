import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tutorial-popover',
  templateUrl: './tutorial-popover.component.html',
  styleUrls: ['./tutorial-popover.component.scss'],
})
export class TutorialPopoverComponent  implements OnInit {


  ngOnInit() {}

  @Input() message: string | null = '';

  constructor(private popoverController: PopoverController) {}

  closePopover() {
    this.popoverController.dismiss();
  }

}
