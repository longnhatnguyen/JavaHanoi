import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

interface IAppConfig {
  ApiUrl: string;
  ClientId: string;
}

@Injectable()
export class Configuration {
  public ApiUrl = 'https://api-dev.smartgapcontract.vn/api/';
  public ClientId = 'EContractSmartGap';

  load() {
    return fetch('assets/config/configuration.json').then(res => res.json())
      .then((jsonData: IAppConfig) => {
        let settings = (<IAppConfig>jsonData);
        this.ClientId = settings.ClientId;
        this.ApiUrl = settings.ApiUrl;
      }).catch((error) => {
        console.log("load config fail")
      });
  }
}
