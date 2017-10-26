import { Model } from '@mean-expert/model';
import {Device} from "../../../webapp/src/app/shared/sdk/models/Device";
/**
 * @module user
 * @description
 * Write a useful user Model description.
 * Register hooks and remote methods within the
 * Model Decorator
 **/
@Model({
  hooks: {
    beforeSave: { name: 'before save', type: 'operation' },
    afterRemoteLogin: { name: 'login', type: 'afterRemote' },
    afterRemoteCreate: { name: 'create', type: 'afterRemote' }
  },
  remotes: {
    myRemote: {
      returns : { arg: 'result', type: 'array' },
      http    : { path: '/my-remote', verb: 'get' }
    },
    postDownlink: {
      accepts: {
        arg: 'data',
        type: 'Message',
        http: {
          source: 'body'
        }
      },
      http: {
        path: '/downlink',
        verb: 'post'
      },
      returns: {
        arg: 'deviceId',
        type: 'Object',
        root: true
      }
    }
  }
})

class user {
  // LoopBack model instance is injected in constructor
  constructor(public model: any) {}

  // Example Operation Hook
  beforeSave(ctx: any, next: Function): void {
    console.log('user: Before Save');
    next();
  }

  afterRemoteLogin(context: any, loggedUser: any, next: any) {

    let now = Date.now();

    let user = {
      id: loggedUser.userId,
      lastLogin: now
    };

    console.log(loggedUser);
    this.model.app.models.user.upsert(
      user,
      (err: any, response: any) => {
        if(err){
          console.log(err)
        }else{
          console.log(response);
        }
        next();
      });
  }

  afterRemoteCreate(context: any, user: any, next: any) {

    let organization = {
      name: user.email,
      ownerId:user.id,
    };

    user.Organizations.create(
      organization,
      (err: any, organizationInstance: any) => {
      if(err){
        console.log(err)
      }else{
        console.log(organizationInstance);
        // console.log(user);
        // organizationInstance.users.add(user,
        //   (err: any, organization: any) => {
        //     if(err){
        //       console.log(err)
        //     }else {
        //       console.log(organization);
        //     }
        // })

      }
      next();
    });

    // // this.model.app.models.Organization.create(
    // //   organization,
    //   (err: any, response: any) => {
    //     if(err){
    //       console.log(err)
    //     }else{
    //       console.log(response);
    //       this.model.app.models.Organization.link()
    //     }
    //     next();
    //   });
  }

  // Example Remote Method
  myRemote(next: Function): void {
    this.model.find(next);
  }


  // Remote method
  postDownlink(data: any, cb: any) {
    this.model.app.models.Device.findOne({where: {id: data.deviceId}}, function (err: any, device: Device) {
      let results;
      if(device && device.dl_payload){
        results = {
          [data.deviceId]:{
            downlinkData: device.dl_payload
          }
        }
      } else {
        results = {
          [data.deviceId]:{
            noData: true
          }
        }
      }
      cb(null, results);
    });
  }
}

module.exports = user;
