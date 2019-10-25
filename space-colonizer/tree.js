function Tree(x, y, sketch) {
  this.branches = [];

  var pos = sketch.createVector(x, y);
  var dir = sketch.createVector(0, -1);
  var root = new Branch(null, pos, dir);

  this.branches.push(root);
  this.grow = function() {
    for (let i = 0; i < leaves.length; i++) {
      var leaf = leaves[i];
      var closestBranch = null;
      var record = max_dist;

      for (let j = 0; j < this.branches.length; j++) {
        var branch = this.branches[j];
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        if (d < min_dist) {
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
    for (let i = leaves.length - 1; i >= 0; i--) {
      if (leaves[i].reached) {
        leaves.splice(i, 1);
      }
    }

    if (leaves.length == 0) {
      return false;
    }

    for (let i = this.branches.length - 1; i >= 0; i--) {
      var branch = this.branches[i];
      if (branch.count > 0) {
        branch.dir.div(branch.count + 1);
        this.branches.push(branch.next());
        branch.reset();
      }
    }
    return true;
  };

  this.show = function(sketch, stroke = null) {
    for (let i = 0; i < this.branches.length; i++) {
      this.branches[i].show(sketch, stroke);
    }
  };

  this.showRoot = function(sketch) {
    this.branches[0].showRoot(sketch);
  };
}
