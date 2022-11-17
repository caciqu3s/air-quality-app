import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'airQuality'
})
export class AirQualityPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    if(value <= 50) {
      return 'GOOD'
    } else if(value > 50 && value <= 100) {
      return 'MODERATE';
    } else if(value > 100 && value <= 150) {
      return 'UNHEALTHY FOR SENSITIVE GROUPS';
    } else if(value > 150 && value <= 200) {
      return 'UNHEALTHY';
    } else if(value > 200 && value <= 300) {
      return 'VERY UNHEALTHY';
    }

    return 'HAZARDOUS';
  }
}
