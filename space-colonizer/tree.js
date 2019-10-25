// Coding Rainbow
// Daniel Shiffman
// http://patreon.com/codingtrain
// Code for: https://youtu.be/kKT0v3qhIQY

function Tree(x, y, sketch) {
  this.branches = [];

  this.min_dist = 2;
  this.max_dist = 100;

  var pos = sketch.createVector(x, y);
  var dir = sketch.createVector(0, -1);
  var root = new Branch(null, pos, dir);

  this.branches.push(root);

  var current = root;
  var found = false;

  if (leaves.length > 0) {
    while (!found) {
      for (var i = 0; i < leaves.length; i++) {
        var d = p5.Vector.dist(current.pos, leaves[i].pos);
        if (d < this.max_dist) {
          found = true;
        }
      }
      if (!found) {
        var branch = current.next();
        current = branch;
        this.branches.push(current);
      }
    }
  }

  this.grow = function() {
    for (var i = 0; i < leaves.length; i++) {
      var leaf = leaves[i];
      var closestBranch = null;
      var record = this.max_dist;

      for (var j = 0; j < this.branches.length; j++) {
        var branch = this.branches[j];
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < this.min_dist) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (d < record) {
          closestBranch = branch;
          record = d;
        }
      }

      if (closestBranch != null) {
        var newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
        newDir.normalize();
        closestBranch.dir.add(newDir);
        closestBranch.count++;
      }
    }
    for (var i = leaves.length - 1; i >= 0; i--) {
      if (leaves[i].reached) {
        leaves.splice(i, 1);
      }
    }

    if (leaves.length == 0) {
      return false;
    }

    for (var i = this.branches.length - 1; i >= 0; i--) {
      var branch = this.branches[i];
      if (branch.count > 0) {
        branch.dir.div(branch.count + 1);
        this.branches.push(branch.next());
        branch.reset();
      }
    }
    return true;
  };

  this.show = function(sketch) {
    for (var i = 0; i < this.branches.length; i++) {
      this.branches[i].show(sketch);
    }
  };
}
