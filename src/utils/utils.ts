import { parse } from 'qs';

export const BlobToBase64 = (blob: Blob) => {
  if (!blob) return;

  return new Promise(resolve => {
    const reader = new FileReader();

    reader.readAsDataURL(blob);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
};

export const ObjectToUrl = (obj: any): string => {
  return Object.keys(obj)
    .map(key => {
      if (obj[key] !== undefined && obj[key] !== null) {
        return key + '=' + encodeURIComponent(obj[key]);
      }
    })
    .join('&');
};

export const IsEmptyObject = (obj: object): boolean => {
  if (!obj) return true;

  let isEmpty = true;

  for (let i in obj) {
    isEmpty = false;
    break;
  }

  return isEmpty;
};

export const IsUrl = (path: string): boolean => {
  const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

  return reg.test(path);
};

export const GetPageQuery = (): any => {
  return parse(window.location.href.split('?')[1]);
};

// /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
export const urlToList = (url: string) => {
  const urllist = url.split('/').filter(i => i);

  return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join('/')}`);
};


export const spliceDownloadUrl = (url: any, params: object) => {
  return `${url}${
    !IsEmptyObject(params) ? '?' + ObjectToUrl({ params: JSON.stringify(params) }) : ''
  }`;
};
