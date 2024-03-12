const FormComponent = () => {
    const [inputValue, setInputValue] = useState('');
  
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log('Submitted value:', inputValue);
      // Perform any desired actions with the submitted value
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <button type="button">Button 1</button>
          <button type="button">Button 2</button>
        </div>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  };
  
  ReactDOM.render(React.createElement(FormComponent), document.getElementById('root'));