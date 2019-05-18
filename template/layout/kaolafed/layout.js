import 'element-kaola/index.scss';
import 'nek-ui/dist/css/nek-ui.default.min.css';
import './styles/index.scss';

import BaseComponent from './common/regular/BaseComponent';
import { API, goLogin } from './common/api';

import template from './index.html';

export default BaseComponent.extend({
    template,

    config(data) {
        this.supr(data);
    },

    init() {
        this.supr();
        this.setUserInfo();
        this.setMenus();
    },

    async setUserInfo() {
        try {
            const { result } = await API.getUserInfo();

            this.data.userInfo = result && result.userInfo || {};
        } catch (err) {
            console.log(err);
        }
    },

    async fetchMenus() {
        try {
            const { result } = await API.getMenus();
            return result && result.list || [];
        } catch (err) {
            console.log(err);
        }
    },

    async setMenus() {
        const menus = await this.fetchMenus();
        const currentPage = location.hash;

        menus.forEach(menu => {
            const matchedItem = menu.children.find(item => item.url.includes(currentPage));
            if (matchedItem) {
                matchedItem.open = true;
                menu.open = true;
            }
        });

        this.data.menus = menus;
        this.$update();
    },

    async onLogout() {
        try {
            await API.logout();
            goLogin();
        } catch (err) {
            console.log(err);
        }
    }
});
