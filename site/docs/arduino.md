# Arduino and circuits

Click **Arduino** in the dock. Write sketches for an Arduino Uno, Nano, Mega or Leonardo, upload them, talk to the board, or build the circuit and simulate it with no board at all.

## Set up

The first time, Aether downloads the Arduino tools (arduino-cli, the same engine as the Arduino IDE 2) and the boards into its own folder. It picks up where a cut-off download stopped, and checks every file. Sketches and libraries go in `Documents\Arduino`, where the Arduino IDE finds them too.

## Writing a sketch

- **New sketch** in Documents\Arduino, the open folder or any folder. Opening an `.ino` file opens it here.
- Nine examples: Blink, Button and LED, Fade, Read a knob, Talk over Serial, Servo sweep, Distance sensor, Traffic light and Buzzer tune.
- Suggestions know your sketch first (its variables, pins, functions and objects), then Arduino's words. After `servo.` or `lcd.` you get that object's functions. While you type a call, a hint shows what goes in the brackets.
- A drawing of the board lights up the pins the sketch uses, and warns when `analogWrite` is on a pin without PWM.

## Verify and upload

- **Verify** (**Ctrl+R**) checks the sketch. Errors are marked on their lines; program and memory use show as bars.
- **Upload** (**Ctrl+U**) puts it on the board. The board and port are found by themselves, with a list to pick another.
- **Libraries**: search, install and see the ones you have.

## Serial Monitor and Plotter

- **Serial Monitor**: read what the board prints and send it text, with baud rate, line ending, timestamps and autoscroll. It reconnects after an upload.
- **Serial Plotter**: numbers the board prints (`12,34` or `temp:21.5,hum:40`) draw as live lines.

## Circuits and simulation

Switch between **Code**, **Both** (side by side) and **Circuit**.

- **Parts**: Uno, Nano and Mega boards, breadboards, LEDs and RGB LEDs, resistors, buttons, switches, knobs, a buzzer, a servo, a stepper motor, a relay, LCDs (16x2, 20x4), an OLED, 7-segment displays, NeoPixels, sensors and more. Drag one in, or click it.
- **Wires**: drag from one pin to another, or click a pin, click to bend, click another pin. Ground wires are black, power red and signals green, with ten colours to pick.
- Parts dropped on a breadboard plug into its holes. Bend a part's legs into other holes, turn (**R**) and flip (**H**, **V**) parts.
- The inspector sets a part's colour, resistance or address and says how to wire it.

Press **Simulate** (**F5**): the sketch runs on a simulated board. LEDs light and dim, buttons and knobs feed the pins, servos and steppers turn, buzzers play, displays show what the sketch draws, and sensors get sliders (distance, temperature, light, motion...). `Serial.print` goes to the Serial Monitor. Aether warns about a short circuit or an LED with no resistor.

**Power only** uses the Arduino just as a power supply for a circuit you wire by hand, with no code.

The circuit saves next to the sketch, as `name.circuit.json`.
