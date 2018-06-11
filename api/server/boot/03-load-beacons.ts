module.exports = (app: any) => {

  const runScript = false;

  if (runScript) {
    const Beacon = app.models.Beacon;
    Beacon.destroyAll(null, (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        const beacons_1 = [
          {id: '11101', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 48.883584, lng: 2.302417})},
          {id: '11103', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 48.883160, lng: 2.302553})}
        ];
        beacons_1.forEach((beacon) => {
          Beacon.create(beacon, (err: any, beacon: any) => {
            if (err) {
              console.error(err);
            }
          });
        });

        const beacons_2 = [
          {id: '00001', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480627, lng: -0.440639})},
          {id: '00002', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480595, lng: -0.440111})},
          {id: '00003', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480361, lng: -0.440651})},
          {id: '00004', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480343, lng: -0.440156})},
          {id: '00005', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480426, lng: -0.440393})}
        ];
        beacons_2.forEach((beacon) => {
          Beacon.create(beacon, (err: any, beacon: any) => {
            if (err) {
              console.error(err);
            }
          });
        });

        const beacons_3 = [
          {id: '0000a', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480473, lng: -0.440661})},
          {id: '0000b', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480448, lng: -0.440493})},
          {id: '0000c', type: 'sigfox', location: new app.loopback.GeoPoint({lat: 51.480508, lng: -0.440181})}
        ];
        beacons_3.forEach((beacon) => {
          Beacon.create(beacon, (err: any, beacon: any) => {
            if (err) {
              console.error(err);
            }
          });
        });
      }
    });
  }
};
