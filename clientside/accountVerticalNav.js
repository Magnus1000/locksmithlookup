const VerticalNav = () => {
    // Assuming you might want to manage which menu item is active
    const [activeItem, setActiveItem] = React.useState('dashboard');
  
    // This effect runs once when the component is mounted.
    React.useEffect(() => {
      // Any initialization can go here
    }, []);
  
    // Handler for navigation item clicks
    const handleNavClick = (item) => {
      setActiveItem(item);
      // Here you can also add any actions to perform on navigation item click
      // For example, redirecting to a different page or changing the view
    };
  
    return (
      <div id="verticalNav" className="vertical-nav-wrapper">
        <div className="vertical-nav-menu-wrapper">
          <a href="#" className="vertical-nav-logo-wrapper w-inline-block">
            <img
              src="https://assets-global.website-files.com/65f04d35c17450fc8221d933/65f36c6ba6275a8d3638ddd4_eagledutylogo-clear.svg"
              loading="lazy"
              width="71.5"
              alt=""
              className="vertical-nav-image"
            />
            <div className="vertical-nav-text-wrapper">
              <div className="logo-text-dashboard">Locksmith Dispatch</div>
            </div>
          </a>
          <div
            id="dashboardButton"
            className={`vertical-nav-menu-item ${activeItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <div className="nav-menu-text">Calendar</div>
          </div>
          <div
            id="membersButton"
            className={`vertical-nav-menu-item ${activeItem === 'members' ? 'active' : ''}`}
            onClick={() => handleNavClick('members')}
          >
            <div className="nav-menu-text">Members</div>
          </div>
        </div>
      </div>
    );
};
  
// This will render the VerticalNav component inside the div with id 'verticalNav'
ReactDOM.render(<VerticalNav />, document.getElementById('verticalNav'));
  