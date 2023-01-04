class Tree {
    
    constructor(position, height, brach_length, spread_degree) {
        self.position = position
        self.height = height
        self.brach_length = brach_length
        self.spread_degree = spread_degree

        self.branches = []
    }

    create(number_branches) {
        // Will initialize the tree structure
        const position = self.position
        const height = self.height
        const branch_length = self.brach_length
        const spread_degree = self.spread_degree

        if (height <= 1) return 

        for (let i = 0; i < number_branches; i++) {
            const new_x = position[0] + branch_length * Math.cos(i * spread_degree)
            const new_y = position[1] + branch_length * Math.sin(i * spread_degree)
            const new_position = [new_x, new_y]

            let new_branch = new Tree(new_position, height - 1, branch_length / 2, spread_degree)

            self.branches.push(new_branch)
            new_branch.create(2)
        }

    }

    get_tree_points() {
        if (self.branches.brach_length == 0) {
            return []
        } 
        
        let points = []
        
        for (let branch of self.branches) {
            points.push([self.position, branch.position])
            
            points.concat(branch.get_tree_points())
        }

        return points
    }
}

function Render (tree) {
    // tree -> List of points that compose the tree
    console.log(tree)
}

new_tree = Tree()