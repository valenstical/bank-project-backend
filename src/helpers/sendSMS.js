import request from 'request-promise';
import urlencode from 'urlencode';

export class SMS {
  static send(message, phone) {
    const url = `http://login.betasms.com/api/?sender=${urlencode(
      'Project',
    )}&username=${process.env.SMS_USERNAME}&password=${
      process.env.SMS_PASSWORD
    }&message=${urlencode(message)}&mobiles=${phone}`;
    request(url)
      .then((m) => {})
      .catch((e) => {});
  }
}

export default {};
