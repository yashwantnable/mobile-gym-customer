export const user_role = {
  customer: 3,
};

// const localUrl = "http://localhost:5000";
const localUrl = "http://192.168.1.17:5000";

const isLive = false;

export const serverUrl = isLive ? liveUrl : localUrl;
export const server = isLive ? `${liveUrl}/api/v1/` : `${localUrl}/api/v1/`;
// export const deliveryServer = isLive
//   ? `${deliveryLiveUrl}/api/v1/`
//   : `${deliveryLocalUrl}/api/v1/`;
