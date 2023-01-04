class Tree {
    
    constructor(position, height, brach_length, orientation, spread_degree) {
        this.orientation = orientation
        this.position = position
        this.height = height
        this.brach_length = brach_length
        this.spread_degree = spread_degree

        this.branches = []
    }

    grow(number_branches) {
        // Will initialize the tree structure
        const position = this.position
        const height = this.height
        const branch_length = this.brach_length
        const spread_degree = this.spread_degree

        if (height <= 0) return 

        for (let i = 1; i <= number_branches; i++) {
            
            let new_orientation = this.orientation - spread_degree * Math.ceil(i/2)
            if (i % 2 == 0) new_orientation = this.orientation + spread_degree * Math.ceil(i/2)
        
            const new_x = position[0] + branch_length * Math.cos(new_orientation)
            const new_y = position[1] + branch_length * Math.sin(new_orientation)
            const new_position = [new_x, new_y]

            let new_branch = new Tree(new_position, height - 1, branch_length / 1.2, new_orientation, this.spread_degree)

            this.branches.push(new_branch)     
        }

        for (let branch of this.branches) {
            branch.grow(number_branches)
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

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let [p1, p2] of tree) {
        context.beginPath()
        context.moveTo (p1[0], p1[1]);   context.lineTo (p2[0], p2[1]);  
        context.stroke()
    }
    
}

const direction_slider = document.getElementById("tree-direction")
const spread_slider = document.getElementById("branches-spread")

const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500

const sliders = document.getElementsByTagName("input")

for (let slider of sliders) {
    slider.addEventListener("input", updateTree)
}

function updateTree () {
    const direction_value = 2*Math.PI * Number(direction_slider.value)/100
    const spread_value = Math.PI/3 * Number(spread_slider.value)/100

    console.log(direction_value, spread_value)

    new_tree = new Tree([250, 250], 3, 50, direction_value, spread_value)
    new_tree.grow(4)
    Render(context, new_tree.get_tree_points())
}

