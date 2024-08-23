# JD_SLS4121_LMCFilm
<!-- technology tools and platforms used, feature implemented for this version 0.0.0, including the rationale for selecting it, bugs fixed, and known issues. See the details in assignment description. -->

Our project is built on the MERN stack, which stands for MongoDB, Express.js, React.js, and Node.js. This architecture allows for seamless integration between the frontend and backend components, providing a robust and scalable foundation for our application. Currently, our frontend is developed using React.js, providing a dynamic and responsive user interface, while our backend relies on Google Firebase as a temporary database solution. However, we plan to transition to a more integrated backend solution in the near future to optimize performance and security.

To design and prototype our frontend, we utilized Figma, enabling us to create intuitive user interfaces that meet the specific requirements of our stakeholders. Additionally, task management and workflow coordination were facilitated through Jira, ensuring efficient collaboration and progress tracking across our development team.

In this version (0.0.0) of our project, we focused on implementing key features to enable users to efficiently navigate and interact with our system. Specifically, users can now enter a class code, select a class section, choose a reservation time, and add or remove necessary equipment, all seamlessly integrated into a shopping cart and checkout process. This user story was prioritized as it addresses a critical aspect of our system, ensuring that LMC users at GaTech can easily access and utilize the rental equipment system to meet their needs.

Throughout the development process, we addressed various bugs and issues to enhance the overall functionality and user experience. These included resolving font, style, and position misalignments, correcting function expectation mismatches, and optimizing layout adjustments for smaller screens.

Looking ahead, a primary challenge lies in migrating our data storage solution from Google Firebase to a more secure and mature approach, such as transitioning to a full-fledged MERN stack implementation. This transition will enable us to leverage the full capabilities of MongoDB for data management and Express.js for server-side operations, ensuring the long-term stability and scalability of our application.






<!-- Frontend Initial Setup -->

1. make sure your local branch is up to date
2. go inside "frontend" directory
3. run "git install" (this is to install the dependencies from liberary)
4. run "npm start" (this is to ONLY start the frontend in port 3000)

<!-- Frontend Update -->

1. You only need to run "npm install" to update packages. Other steps are the same from Initial Setup


<!-- Backend -->

1. Running command: "npm run dev"