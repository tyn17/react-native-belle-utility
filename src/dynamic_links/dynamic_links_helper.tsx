
export interface DynamicLinkData {
    page: string;
    params: any;
};
export const parseDynamicLink = (
    link: any,
    callback: (data: DynamicLinkData) => void,
): void => {
    if (link && link.url) {
      const parts = link.url.split('?');
      const paths = parts[0].split('/');
      const page = paths[paths.length - 1];
      const params: any = {};
      if (parts.length > 1) {
        const queries = parts[1].split('&');
        for (var i = 0; i < queries.length; i++) {
          const pair = queries[i].split('=');
          params[pair[0]] = pair[1];
        }
      }

      var data = {
        page: page,
        params: params
      };
      callback(data);
    }
  };
  