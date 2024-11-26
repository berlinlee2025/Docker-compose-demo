
const ColorName = ( { eachColor }) => {
    return eachColor ?
    (
        <div className='color-name'> 
            <strong>Color Names:  
                {eachColor}
            </strong> 
        </div>
    ) : (
        <div className='color-name'> 
            <strong>Try detecting again, use .jpg format
            </strong> 
        </div>
    )
}

export default ColorName;

