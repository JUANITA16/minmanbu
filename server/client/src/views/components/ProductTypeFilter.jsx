import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

function ProductTypeFilter({ value, onChange }) {
  return (
    <FormControl variant="standard" sx={{ marginTop: 2}} fullWidth>
      <InputLabel id="productTypeLabel">Tipo de producto</InputLabel>
      <Select
        className="valid"
        labelId="productTypeLabel"
        name="producttype"
        value={value}
        onChange={onChange}
        sx={{fontSize: 16, border: 'red 5px none'}}
        fullWidth
        >
        <MenuItem key='0' value='CDT'>
          CDT
        </MenuItem>
        <MenuItem key='1' value='BONO'>
          BONO
        </MenuItem>
      </Select>
    </FormControl>
  )
}

export default ProductTypeFilter;