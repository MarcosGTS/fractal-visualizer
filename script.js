class Tree {
    
    constructor(position, height, brach_length, orientation) {
        this.orientation = orientation
        this.position = position
        this.height = height
        this.brach_length = brach_length
        this.spread_degree = 1

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
            const new_orientation = i * spread_degree + this.orientation * 0.75
            const new_x = position[0] + branch_length * Math.cos(new_orientation)
            const new_y = position[1] + branch_length * Math.sin(new_orientation)
            const new_position = [new_x, new_y]

            let new_branch = new Tree(new_position, height - 1, branch_length / 1.2, new_orientation)

            this.branches.push(new_branch)     
        }

        for (let branch of this.branches) {
            branch.create(2)
        }

    }

    get_tree_points() {
        
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

function Render (context, tree) {
    
    for (let [p1, p2] of tree) {
        context.beginPath()
        context.moveTo (p1[0], p1[1]);   context.lineTo (p2[0], p2[1]);  
        context.stroke()
    }
    
}

const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500
new_tree = new Tree([250, 250], 3, 50, 3.1415 * 3/2)
new_tree.create(2)

Render(context, new_tree.get_tree_points())