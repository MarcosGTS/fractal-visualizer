class Tree {
    
    constructor(position, height, branch_length, 
                orientation, spread_degree, 
                spread_factor, decrease_factor) {

        this.orientation = orientation
        this.position = position
        this.height = height
        
        // changeble parameters
        this.branch_length = branch_length
        this.spread_degree = spread_degree
        this.spread_factor = spread_factor
        this.decrease_factor = decrease_factor

        this.branches = []
    }

    create(inital_orientation, orientation) {
        const new_orientation = inital_orientation 
        const new_branch_length = this.branch_length * this.decrease_factor
        const new_x = this.position[0] + this.branch_length * Math.cos(new_orientation)
        const new_y = this.position[1] + this.branch_length * Math.sin(new_orientation)
        const new_position = [new_x, new_y]

        let new_branch = new Tree(
            new_position, 
            this.height - 1, 
            new_branch_length, 
            new_orientation, 
            this.spread_degree,
            this.spread_factor,
            this.decrease_factor)

        this.branches.push(new_branch) 
        
        new_branch.grow(this.spread_factor, orientation)
    }

    grow(number_branches, orienation) {
        // Will initialize the tree structure
        const position = this.position
        const height = this.height
        const branch_length = this.branch_length
        const spread_degree = this.spread_degree

        if (height <= 0) return 

        const half = Math.floor(number_branches/2)
        
        for (let i = -half; i <= half; i++) {
            
            if (number_branches % 2 == 0 && i == 0) continue

            const new_orientation = this.orientation + spread_degree * i + orienation
            const new_branch_length = branch_length * this.decrease_factor

            const new_x = position[0] + branch_length * Math.cos(new_orientation)
            const new_y = position[1] + branch_length * Math.sin(new_orientation)
            const new_position = [new_x, new_y]

            let new_branch = new Tree(
                new_position, 
                height - 1, 
                new_branch_length, 
                new_orientation, 
                this.spread_degree,
                this.spread_factor,
                this.decrease_factor)

            this.branches.push(new_branch)     
        }

        for (let branch of this.branches) {
            branch.grow(this.spread_factor, orienation)
        }

    }

    get_tree_lines() {
        
        if (this.branches.length == 0) {
            return []
        } 
        
        let points = []
        
        for (let branch of this.branches) {
            const line = {
                height: branch.height,
                coordinates: [this.position, branch.position]
            }

            points.push(line)
            
            points = points.concat(branch.get_tree_lines())
        }

        return points
    }
}

function Render (context, tree) {

    context.clearRect(0, 0, canvas.width, canvas.height);
    
    const lines = tree.get_tree_lines()
    const width_factor = 10 / tree.height

    for (let line of lines) {
        const [p1, p2] = line.coordinates
        
       
        context.lineWidth = line.height * width_factor
        context.lineCap = 'round'

        context.beginPath()
        context.moveTo (p1[0], p1[1]);   context.lineTo (p2[0], p2[1]);  

        context.strokeStyle = line.height > 3 ? "rgb(139,69,19)" : "rgb(58,95,11)"
        context.stroke()
    }
    
}

const direction_slider = document.getElementById("tree-direction")
const spread_slider = document.getElementById("branches-spread")
const height_slider = document.getElementById("height")
const spread_factor_slider = document.getElementById("spread-factor")
const decrease_factor_slider = document.getElementById("decrease-factor")

const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500

const sliders = document.getElementsByTagName("input")

for (let slider of sliders) {
    slider.addEventListener("input", updateTree)
}

function updateTree () {
    const position = [250, 400]
    const branch_size = 70
    const height_value = Number(height_slider.value)
    const spread_factor_value = Number(spread_factor_slider.value)
    const decrease_factor_value = Number(decrease_factor_slider.value)
    const direction_value = Math.PI * Number(direction_slider.value) / 100
    const spread_value = Math.PI/3 * Number(spread_slider.value) / 100

    new_tree = new Tree(
        position,              // Position 
        height_value,          // Height
        branch_size,           // Branch Size
        direction_value,       // Direction
        spread_value,          // Spread between branches
        spread_factor_value,   // Spread Factor
        decrease_factor_value) // Decrease Factor

    new_tree.create(Math.PI * 3/2, direction_value)
    Render(context, new_tree)
}

updateTree()