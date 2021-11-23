import { Component, VERSION } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  createDataContainer(data, isLiqChildObj?, liqChildObj?) {
    console.log(data);
    let hashMapObject = [];
    let liqObject = data;
    let eachLiqObj = data;
    let tempObject = {};
    // liqObject.forEach(eachLiqObj => {
    eachLiqObj = isLiqChildObj ? eachLiqObj : eachLiqObj['LiqBusinessObject'];
    if (eachLiqObj instanceof Array) {
      eachLiqObj.forEach((eachObj) => {
        let childObject = {};
        if (
          eachObj['LiqBusinessObject'] &&
          eachObj['LiqBusinessObject'].length > 0
        ) {
          childObject = this.createDataContainer(
            eachObj['LiqBusinessObject'],
            true,
            eachObj
          );
        }
        tempObject[eachObj['@name']] = this.parseGroupArray(
          eachObj['groups'],
          childObject
        );
      });
    } else {
      let childObject = {};
      if (
        eachLiqObj['LiqBusinessObject'] &&
        eachLiqObj['LiqBusinessObject'].length > 0
      ) {
        childObject = this.createDataContainer(
          eachLiqObj['LiqBusinessObject'],
          true,
          eachLiqObj
        );
      }
      if (eachLiqObj['groups'] !== undefined) {
        tempObject[eachLiqObj['@name']] = this.parseGroupArray(
          eachLiqObj['groups'],
          childObject
        );
        // tempObject[eachLiqObj['@name']] = this.parseGroupArray(eachLiqObj['groups'], childObject) ;
      }
      //tempObject[eachLiqObj['@name']] = this.parseGroupArray(eachLiqObj['groups'], childObject);
    }
    // });
    if (liqObject[0] && liqObject[0]['@name'] === 'deal') {
      hashMapObject.push(tempObject['deal'][0]);
    } else if (liqObject['@name']) {
      hashMapObject[liqObject['@name']] = tempObject;
    } else if (isLiqChildObj) {
      return tempObject;
    }
    return hashMapObject;
  }

  parseGroupArray(groupDataArray, childObject?) {
    let groupArray = [];
    if (groupDataArray.length > 0) {
      groupDataArray.forEach((eachGroup) => {
        let groupObject = {};
        eachGroup['items'].forEach((eachAttribute) => {
          groupObject[eachAttribute['@attribute']] =
            this.getAttributeValue(eachAttribute);
        });
        if (childObject) {
          Object.entries(childObject).forEach(([key, value]) => {
            groupObject[key] = value;
          });
        }
        groupArray.push(groupObject);
      });
    }
    return groupArray;
  }

  getAttributeValue(attribute) {
    return attribute['@value'] ? attribute['@value'] : '';
  }
}
