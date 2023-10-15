import {
  childrenModel,
  ParentModel,
  ParentSideModel,
  subChildrenModel,
} from '../../Interfaces/navs.model';
import { TitleServiceService } from '../../shared-serviceses/title-service.service';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
  RoutesRecognized,
} from '@angular/router';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  @Input() appRoutes!: ParentSideModel[];
  routes!: ParentModel[];
  oldItem: ParentSideModel | null | any;
  subChildItem!: childrenModel;
  isCollapsed: boolean = false;
  oldChild!: childrenModel | null;
  oldSubChild!: subChildrenModel | null;
  normalImgSrc = '../../../../assets/images/moca-logo.png';
  collapsedImgSrc = '../../../../assets/images/moca-collapsed-logo.svg';
  imgSrc = this.normalImgSrc;

  @Input() sideBarConfig = {
    icon: '',
  };
  constructor(
    public service: TitleServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activateMainRoute();
    console.log(this.appRoutes);
    this.checkActiveRouter(this.router.url);
    this.activateMainRoute();
    this.onRouteChange();
    console.log(this.appRoutes);
    this.service.isUser.emit(true);
  }

  onRouteChange() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.CollapseSideBar();
      }
    });
  }

  deActivateAll(MainRoute: any, subChild?: any) {
    this.appRoutes.forEach((element: any) => {
      element.active = false;
      if (element.children) {
        element.children.forEach((child: any) => {
          child.active = false;
          if (child.subChildren) {
            child.subChildren.forEach((subChild: any) => {
              subChild.active = false;
            });
          }
        });
      }
    });

    if (subChild) {
      subChild.active = false;
      this.oldSubChild = null;
    }
  }

  linkClicked(item: any) {
    this.deActivateAll(item);
    if (this.isCollapsed == true) {
      this.deCollapseSideBar();
    }

    // this.activateMainRoute();
    if (!this.oldItem) {
      this.oldItem = item;
      item.active = !item.active;
    } else {
      if (this.oldItem.id === item.id) {
        this.oldItem.active = false;
        this.oldItem = null;
      } else {
        this.appRoutes.forEach((element: any) => {
          element.active = false;
        });
        this.oldItem = item;
        item.active = !item.active;
        this.routes = item.mainParent;
      }
    }
  }

  onChildClickWithoutSub(
    event: any,
    MainRoute: ParentSideModel,
    childRoute: childrenModel
  ) {
    this.deActivateAll(MainRoute);
    childRoute.active = true;
    this.oldItem = MainRoute;
    this.oldChild = childRoute;
    MainRoute.active = true;
    this.navigate(childRoute.route);
    event.stopPropagation();
  }

  onChildClick(event: any, child: childrenModel, parent: ParentSideModel) {
    this.deActivateAll(parent);
    this.oldItem = parent;
    this.oldChild = child;
    parent.active = true;
    child.active = !child.active;
    this.subChildItem = child;
    event.stopPropagation();
    console.log('child clicked');
  }

  onClickSubChild(
    event: any,
    parent: ParentSideModel,
    child: childrenModel,
    subChild: subChildrenModel
  ) {
    this.deActivateAll(parent, this.oldSubChild);
    this.oldItem = parent;
    this.oldChild = child;
    this.oldSubChild = subChild;
    parent.active = true;
    child.active = true;
    subChild.active = true;
    this.navigate(subChild.route);
    event.stopPropagation();
  }

  toggleActiveClass() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed == false) {
      this.imgSrc = this.normalImgSrc;
    } else {
      this.imgSrc = this.collapsedImgSrc;
    }
    this.appRoutes.forEach((element: any) => {
      element.active = false;
    });
    console.log(this.isCollapsed);
    this.activateMainRoute();
  }

  CollapseSideBar() {
    this.isCollapsed = true;
    this.imgSrc = this.collapsedImgSrc;
    this.activateMainRoute();
  }

  deCollapseSideBar() {
    this.isCollapsed = false;
    this.imgSrc = this.normalImgSrc;
    this.activateMainRoute();
  }

  checkActiveRouter(url: any, MainRoute?: any, childRoute?: boolean) {
    if (childRoute) {
      if (MainRoute) {
        MainRoute.active = true;
      }
      this.oldItem = MainRoute;
      return true;
    }
    if (url == this.router.url) {
      if (MainRoute) {
        MainRoute.active = true;
      }
      this.oldItem = MainRoute;
      return true;
    } else {
      return false;
    }
  }

  navigate(url: string | undefined) {
    this.router.navigate([url]);
  }

  findParent(url: any): any {
    for (let parent of this.appRoutes) {
      if (parent.route == url || url.indexOf(parent.route) > -1) {
        let returnArr = [parent];
        return returnArr;
      } else if (parent.children) {
        for (let child of parent.children) {
          if (child.route == url || url.indexOf(child.route) > -1) {
            let returnArr = [parent, child];
            return returnArr;
          } else if (child.subChildren) {
            for (let subChild of child.subChildren) {
              if (subChild.route == url || url.indexOf(subChild.route) > -1) {
                let returnArr = [parent, child, subChild];
                return returnArr;
              }
            }
          }
        }
      }
    }
  }

  activateMainRoute() {
    if (this.findParent(this.router.url)) {
      let returnArr: any = this.findParent(this.router.url);
      if (returnArr.length == 1) {
        this.oldItem = returnArr[0];
      }
      if (returnArr.length == 2) {
        this.oldItem = returnArr[0];
        this.oldChild = returnArr[1];
      }
      if (returnArr.length == 3) {
        this.oldItem = returnArr[0];
        this.oldChild = returnArr[1];
        this.oldSubChild = returnArr[2];
      }

      this.oldItem.active = true;
    }
  }
}
