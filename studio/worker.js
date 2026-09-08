import {schedule} from './engine.js?v=17';
self.onmessage=({data})=>{try{self.postMessage({id:data.id,result:schedule(data.model)})}catch(error){self.postMessage({id:data.id,error:error.message})}};
