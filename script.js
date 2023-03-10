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

    create(inital_orientation, orientation_offset, random = false) {
        let new_orientation = inital_orientation
        let new_branch_length = this.branch_length * this.decrease_factor
        const new_position = this.get_polar_position(this.position, this.branch_length, new_orientation)

        if (random) {
            new_orientation = add_variation(new_orientation, .1)
            new_branch_length = add_variation(new_branch_length, .05)
        }
        
        let new_branch = new Tree(
            new_position, 
            this.height - 1, 
            new_branch_length, 
            new_orientation, 
            this.spread_degree,
            this.spread_factor,
            this.decrease_factor)

        this.branches.push(new_branch) 
        
        new_branch.grow(orientation_offset, random)
    }

    grow(orienation_offset, is_random) {
        // Will initialize the tree structure
        const position = this.position
        const height = this.height
        const branch_length = this.branch_length
        const spread_degree = this.spread_degree
        const number_branches = this.spread_factor
        const reference_orientation = this.orientation + orienation_offset

        let new_branch_length = branch_length * this.decrease_factor
      
        if (height <= 0 || branch_length < 1) return 

        const half = Math.floor(number_branches/2)
        
        for (let i = -half; i <= half; i++) {
            
            if (number_branches % 2 == 0 && i == 0) continue
            
            let new_orientation = reference_orientation + spread_degree * i
            const new_position = this.get_polar_position(position, branch_length, new_orientation)

            if (is_random) {
                new_orientation = add_variation(new_orientation, .1)
                new_branch_length = add_variation(new_branch_length, .1)
            }
            
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
            branch.grow(orienation_offset, is_random)
        }

    }

    get_polar_position(initial_position, length, rad) {
        
        const x = initial_position[0] + length * Math.cos(rad)
        const y = initial_position[1] + length * Math.sin(rad)

        return [x, y]
    }

    render(context, max_height) {
        if (!max_height) max_height = this.height

        const percentage = (this.height - 1) / max_height
        const width = lerp(MIN_WIDTH, MAX_WIDTH, percentage)
        const color = get_color_between(PRIMARY_COLOR, SECONDARY_COLOR, percentage)
        
        for (const branch of this.branches) {
            branch.render(context, max_height)
        }

        for (const branch of this.branches) {
            draw_line(context, this.position, branch.position, color, width)
        }

    }
}

function Render (context, tree) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round'
    tree.render(context)
}

function draw_line(context, p1, p2, color, width) {
    const [red, green, blue] = color

    context.lineWidth = width
    context.beginPath()
    context.moveTo (p1[0], p1[1]);   context.lineTo (p2[0], p2[1]);  

    context.strokeStyle = `rgb(${red},${green},${blue})`
    context.stroke()
}

const save_btn = document.getElementById("save")
const refresh_btn = document.getElementById("refresh")

const direction_slider = document.getElementById("tree-direction")
const spread_slider = document.getElementById("branches-spread")
const height_slider = document.getElementById("height")
const spread_factor_slider = document.getElementById("spread-factor")
const decrease_factor_slider = document.getElementById("decrease-factor")
const randomness_input = document.getElementById("randomness")

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
    randomness_input
]

const stylish_inputs =[
    primary_color_input,
    secondary_color_input,
    min_width_slider,
    max_width_slider,
]

let new_tree = undefined

// SETTING EVENTS

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

canvas.addEventListener("click", updateTree)
save_btn.addEventListener("click", save_image)
refresh_btn.addEventListener("click", updateTree)
randomness_input.addEventListener("input", () => {
    if (!randomness_input.checked) {
        refresh_btn.classList.add("hide")
    } else {
        refresh_btn.classList.remove("hide")
    }
})

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
    const spread_value = Math.PI / 2 * Number(spread_slider.value) / 100
    const randomness_value = randomness_input.checked

    // Estructural parameters
    new_tree = new Tree(
        position,              // Position 
        height_value,          // Height
        branch_size,           // Branch Size
        direction_value,       // Direction
        spread_value,          // Spread between branches
        spread_factor_value,   // Spread Factor
        decrease_factor_value) // Decrease Factor

    new_tree.create(Math.PI * 3/2, direction_value, randomness_value)

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

function save_image() {
    const data = canvas.toDataURL("image/jpg", 1.0)
    const link = document.createElement('a')

    link.href = data
    link.download = 'fractal_tree'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

updateTree()