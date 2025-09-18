import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { NumberInputProps } from './number-input-props';
import { Slider } from '@mui/material';

export function CustomizedSlider(props: NumberInputProps) {

    const handleChange = (_: Event, newValue: number) => {
        props.onChange(newValue);
    };

    return (
        <Box sx={{
            width: '100%'
        }}>
            <Typography id={props.id}
                fontSize={"1.1rem"}
                color="#717275"
                lineHeight="1.1"
            >
                {props.caption}
            </Typography>
            <Slider
                value={props.value}
                min={props.min}
                step={1}
                max={props.max}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby={props.id}
                disabled={props.disabled}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    onClick={() => props.onChange(props.min)}
                    sx={{
                        cursor: 'pointer',
                        color: "#344767",
                        fontSize: "1rem"
                    }}
                >
                    {props.min} min
                </Typography>
                <Typography
                    variant="body2"
                    onClick={() => props.onChange(props.max)}
                    sx={{
                        cursor: 'pointer',
                        color: "#344767",
                        fontSize: "1rem"
                    }}
                >
                    {props.max} max
                </Typography>
            </Box>
        </Box>
    );
}
