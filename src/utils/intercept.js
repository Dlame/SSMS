import router from '../router';
import { Message } from 'element-ui';

export function Intercept_Code(res) {
  switch (res.code * 1) {
    case 0:
      return true;
    case 400:
      Message.error({
        message: res.desc
      });
      return false;
    case 401:
      Message.error({
        message: res.desc
      });
      router.push('/login');
      return false;
    case 404:
      Message.error({
        message: res.desc
      });
      router.push('/404');
      return false;
    default:
      Message.error({
        message: res.desc
      });
      return false;
  }
}
