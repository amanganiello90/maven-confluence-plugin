

import * as xml from "xml2js";
import * as filesystem from "fs";
import * as path from "path";
import traverse = require('traverse');
import Rx = require("rx");


let parser = new xml.Parser();

function removeSingleArrays(obj, filter?:(key:string) => boolean ) {
  // Traverse all the elements of the object
  traverse(obj).forEach(function traversing(value) {
    // As the XML parser returns single fields as arrays.
    if (value instanceof Array && value.length === 1) {
      if( filter && !filter(this.key) ) return;
        this.update(value[0]);
    }
  });
}

let readFile    = Rx.Observable.fromNodeCallback( filesystem.readFile );
let parseString = Rx.Observable.fromNodeCallback( parser.parseString );

readFile( path.join(__dirname,'site.xml') )
  .flatMap( (value:Buffer) => parseString( value.toString() ) )
  .doOnCompleted( () => console.log('Done') )
  .subscribe( (data:Object) => {
    console.dir(data, {depth:8});
  });

/*
filesystem.readFile( path.join(__dirname,'site.xml'), (err, data) => {
    parser.parseString(data.toString(), (err, result) => {
        //removeSingleArrays( result );
        console.dir(result, {depth:8});
        console.log('Done');
    });
});
*/
