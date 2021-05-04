# DesmosToCSS

Animating custom keyframe translations in CSS can be tedious. With DesmosToCSS, it will still be tedious, but hopefully far less so.

## Use Case

Imagine trying to write out this custom path in CSS for your object to follow.

```
@keyframes floater {
   0% {left:50.00%;   bottom:100.00%;}
   5% {left:65.44%;   bottom:97.56%;}
   10% {left:79.38%;   bottom:90.46%;}
   15% {left:90.44%;   bottom:79.41%;}
   20% {left:97.54%;   bottom:65.48%;}
   25% {left:100.00%;   bottom:50.04%;}
   30% {left:97.57%;   bottom:34.59%;}
   35% {left:90.48%;   bottom:20.66%;}
   40% {left:79.44%;   bottom:9.59%;}
   45% {left:65.52%;   bottom:2.47%;}
   50% {left:50.08%;   bottom:0.00%;}
   55% {left:34.63%;   bottom:2.42%;}
   60% {left:20.69%;   bottom:9.49%;}
   64% {left:9.61%;   bottom:20.53%;}
   70% {left:2.48%;   bottom:34.44%;}
   75% {left:0.00%;   bottom:49.88%;}
   80% {left:2.41%;   bottom:65.33%;}
   85% {left:9.47%;   bottom:79.28%;}
   90% {left:20.49%;   bottom:90.37%;}
   95% {left:34.41%;   bottom:97.51%;}
   100% {left:49.84%;   bottom:100.00%;}
}
```

Some long patterns can lead to even more CSS than that! Now, instead of writing out all of it manually, this extension utilizes the power of [Desmos](https://www.desmos.com/calculator) to drastically speed up path generation. Simply define an x and y parametrically in the calculator and let the extension do the rest.

## Process

The extension is live in the chrome web store [here](https://chrome.google.com/webstore/detail/desmostocss/pnopgfmgkgpldjgkehholjfmepeiemnn/). Once you've installed the extension, here's how to use it!

### Step 1: Find your path

Using desmos, create functions for `x` and `y` both defined in terms of some variable `t`. By setting `t` equal to some arbitrary number in the next line, you can create a slider to help you visualize the path of your object.

![example](https://github.com/ebenz99/DesmosToCSS/blob/master/docs/firstStep.gif?raw=true)

### Step 2: Convert to function notation

Remove your `t` slider and change your equations to be functions of `t`, i.e. `x(t)` and `y(t)`.  Also, parenthesize where possible!

![example](https://github.com/ebenz99/DesmosToCSS/blob/master/docs/functions.png?raw=true)

### Step 2: Save and Refresh

To change the function "on-deck" in the extension, you must refresh the desmos tab. Make sure to hit the save button beforehand!

**You're now all set to open up the extension and generate CSS paths to your heart's content!**

