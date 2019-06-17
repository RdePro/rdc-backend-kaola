import { Component, Vue } from 'vue-property-decorator';
import { Util } from '~/vue/index';
import { API } from '../api';

@Component
export default class ListActionMixin extends Vue {
    listService = API.getList;

    onCreate() {
        window.open('/#/pages/vue/demo/form/index');
    }
    async onExport() {
        try {
            const { result } = await API.exportList((this as any).getExtraParam());
            if (result) {
                Util.download(result);
                return;
            }
            (this as any).$message.success('导出内容为空');
        } catch (err) {
            console.log(err);
        }
    }
};
