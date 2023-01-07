let MIN_WIDTH = 2
let MAX_WIDTH = 10
let PRIMARY_COLOR = [59, 95, 11]
let SECONDARY_COLOR = [139, 69, 19]

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

        if (height <= 0 || branch_length < 1) return 

        const half = Math.floor(number_branches/2)
        
        for (let i = -half; i <= half; i++) {
            
            if (number_branches % 2 == 0 && i == 0) continue
            
            let new_orientation = this.orientation + spread_degree * i + orienation
            let new_branch_length = branch_length * this.decrease_factor

            const new_x = position[0] + branch_length * Math.cos(new_orientation)
            const new_y = position[1] + branch_length * Math.sin(new_orientation)
            const new_position = [new_x, new_y]

            new_orientation = add_variation(new_orientation, .1)
            new_branch_length = add_variation(new_branch_length, .05)

            let new_branch = new Tree(
                new_position, 
                height - 1, 
                new_branch_length, 
                new_orientation, 
                this.spread_degree,
                this.spread_factor,
                this.decrease_factor)

            if (new_branch) this.branches.push(new_branch)     
        }

        for (let branch of this.branches) {
            branch.grow(this.spread_factor, orienation)
        }

    }

    get_tree_lines() {
        
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
    const max_height = tree.height

    console.log(lines.length)

    for (let line of lines) {
        const percentage = line.height / max_height
        const [p1, p2] = line.coordinates
        const [red, green, blue] = get_color_between(PRIMARY_COLOR, SECONDARY_COLOR, percentage)
        
        context.lineWidth = lerp(MIN_WIDTH, MAX_WIDTH, percentage)
        context.lineCap = 'round'

        context.beginPath()
        context.moveTo (p1[0], p1[1]);   context.lineTo (p2[0], p2[1]);  

        context.strokeStyle = `rgb(${red},${green},${blue})`
        context.stroke()
    }
    
}

const direction_slider = document.getElementById("tree-direction")
const spread_slider = document.getElementById("branches-spread")
const height_slider = document.getElementById("height")
const spread_factor_slider = document.getElementById("spread-factor")
const decrease_factor_slider = document.getElementById("decrease-factor")

const primary_color_input = document.getElementById("primary-color")
const secondary_color_input = document.getElementById("secondary-color")
const min_width_slider = document.getElementById("min-width")
const max_width_slider = document.getElementById("max-width")

const canvas = document.getElementById("canvas")
const context = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500

const estructural_inputs = [
    direction_slider,
    spread_slider,
    height_slider,
    spread_factor_slider,
    decrease_factor_slider,
]

const stylish_inputs =[
    primary_color_input,
    secondary_color_input,
    min_width_slider,
    max_width_slider,
]

var new_tree = undefined

for (let input of estructural_inputs) {
    input.addEventListener("input", updateTree)
}

for (let input of stylish_inputs) {
    input.addEventListener("input", () => {
        //Rederer paremeters
        PRIMARY_COLOR = convert_hex_to_rgb(primary_color_input.value)
        SECONDARY_COLOR = convert_hex_to_rgb(secondary_color_input.value)

        MIN_WIDTH = Number(min_width_slider.value)
        MAX_WIDTH = Number(max_width_slider.value)

        Render(context, new_tree)
    })
}

function convert_hex_to_rgb(color) {
    const r = parseInt(color.substr(1, 2), 16)
    const g = parseInt(color.substr(3, 2), 16)
    const b = parseInt(color.substr(5, 2), 16)

    return [r, g, b]
}

function updateTree () {
    const position = [250, 400]
    const branch_size = 70
    const height_value = Number(height_slider.value)
    const spread_factor_value = Number(spread_factor_slider.value)
    const decrease_factor_value = Number(decrease_factor_slider.value)
    const direction_value = Math.PI * Number(direction_slider.value) / 100
    const spread_value = Math.PI/3 * Number(spread_slider.value) / 100

    // Estructural parameters
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

function lerp(start_point, goal, t) {
    return start_point + t * (goal - start_point)
}

function get_color_between(color1, color2, t) {
    const red_channel = lerp(color1[0], color2[0], t)
    const green_channel = lerp(color1[1], color2[1], t)
    const blue_channel = lerp(color1[2], color2[2], t)

    return [red_channel, green_channel, blue_channel]
}

function add_variation(value, variation = 0) {
    const percentage = Math.random() * 2 * variation + (1 - variation)
    return value * percentage
}


updateTree()