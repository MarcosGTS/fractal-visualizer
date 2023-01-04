class Tree {
    
    constructor(position, height, brach_length, spread_degree) {
        this.position = position
        this.height = height
        this.brach_length = brach_length
        this.spread_degree = spread_degree

        this.branches = []
    }

    create(number_branches) {
        // Will initialize the tree structure
        const position = this.position
        const height = this.height
        const branch_length = this.brach_length
        const spread_degree = this.spread_degree

        if (height <= 0) return 

        for (let i = 0; i < number_branches; i++) {
            const new_x = position[0] + branch_length * Math.cos(i * spread_degree)
            const new_y = position[1] + branch_length * Math.sin(i * spread_degree)
            const new_position = [new_x, new_y]

            let new_branch = new Tree(new_position, height - 1, branch_length / 2, spread_degree)

            this.branches.push(new_branch)     
        }

        for (let branch of this.branches) {
            branch.create(2)
        }

    }

    get_tree_points() {
        console.log(this.branches.length)
        
        if (this.branches.length == 0) {
            return []
        } 
        
        let points = []
        
        for (let branch of this.branches) {
            points.push([this.position, branch.position])
            
            points = points.concat(branch.get_tree_points())
        }

        return points
    }
}

function Render (tree) {
    // tree -> List of points that compose the tree
    console.log(tree)
}

new_tree = new Tree([0,0], 3, 10, Math.PI)

new_tree.create(2)

Render(new_tree.get_tree_points())