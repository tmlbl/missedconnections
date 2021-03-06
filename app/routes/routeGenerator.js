'use strict';
/**/
//blank route file

exports.routeFactory = function(route, objectPath, app, methodArray){
  //objectPath is assumed to be the file and db object name
  /*
  methodArray is an optional array of strings of the names of the desired
  routes.  If methodArray is omitted, create all methods
  */
  var DbObject = require(objectPath);

  //if(!methodArray || _.find(methodArray, 'collection')){
  var collection = function(req, res){
    if(!req.isAuthenticated()){
      res.send(403);
    }
    res.setHeader('Content-Type', 'application/json');
    DbObject.find({}, function(err, retObject){
      if(err){
        res.send(500, {'error': err});
      } else {
        res.send(JSON.stringify(retObject));
      }
    });
  };
  //set up the basic get collection route
  app.get(route, collection);
  //}

  var findById = function(req, res){
    if(!req.isAuthenticated()){
      res.send(403);
    }
    res.setHeader('Content-Type', 'application/json');
    var id = req.params.id;
    DbObject.findOne({'_id': String(id)}, function(err, retObject){
      if(err){
        res.send(500, {'error': err});
      } else {
        res.send(retObject);
      }
    });
  };
  //set up the get by id route
  app.get(route + '/:id', findById);

  var create = function(req, res){
    if(!req.isAuthenticated()){
      res.send(403);
    }

    //needs validation
    var dbObject = new DbObject(req.body);

    dbObject.makeAuthor(req.sessionStore);

    dbObject.save(function(err, retObject){
      if(err){
        res.send(500, {'error': err});
      } else {
        res.send(200, retObject);
      }
    });
  };
  //set up the create route
  app.post(route, create);

  var update = function(req, res){
    if(!req.isAuthenticated()){
      res.send(403);
    }
    var id = String(req.params.id);
    //get rid of _id to prevent Mongo from shitting a brick
    delete req.body._id;
    var inputObject = req.body;
    //need to put some validation here
    DbObject.update({'_id': id}, inputObject, function(err){
      if(err){
        res.send(500, {'error': err});
      } else {
        res.send({msg: 'success'});
      }
    });
  };
  //sets up the update route
  app.put(route + '/:id', update);

  var destroy = function(req, res){
    if(!req.isAuthenticated()){
      res.send(403);
    }
    var id = String(req.params.id);
    DbObject.remove({'_id': id}, function(err){
      if(err){
        res.send(500, {'error': err});
      } else {
        res.send({msg: 'success'});
      }
    });
  };
  //set up the delete route
  app.delete(route + '/:id', destroy);
};
