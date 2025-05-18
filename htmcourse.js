// Function to save the last visited lesson to localStorage
function saveLastVisitedLesson(lesson) {
    localStorage.setItem('lastVisitedLesson', lesson);
  }
  
  // Automatically click the lesson link when the page loads
  window.addEventListener("DOMContentLoaded", function () {
    // Try to get the last visited lesson from localStorage
    const lastVisitedLesson = localStorage.getItem('lastVisitedLesson');
    
    if (lastVisitedLesson) {
      // If there's a last visited lesson, find it and click it
      const lessonLink = document.querySelector(`.lesson-link[data-lesson="${lastVisitedLesson}"]`);
      
      if (lessonLink) {
        lessonLink.click(); // Automatically click the saved lesson link
      } else {
        console.log(`Last visited lesson "${lastVisitedLesson}" not found.`);
      }
    } else {
      // If no saved lesson is found, click the default lesson ("Introduction to HTML")
      const defaultLessonLink = document.querySelector('.lesson-link[data-lesson="Introduction to HTML"]');
      
      if (defaultLessonLink) {
        defaultLessonLink.click(); // Automatically click the default lesson link
      } else {
        // If the default lesson is not found, log the error or handle the fallback
        console.log('Lesson link "Introduction to HTML" not found!');
      }
    }
  
    // Add click event listener to lessons to save the clicked lesson in localStorage
    document.querySelectorAll('.lesson-link').forEach(link => {
      link.addEventListener('click', function () {
        const lesson = link.dataset.lesson;
        saveLastVisitedLesson(lesson); // Save the clicked lesson
      });
    });
  });
  
  
// Initialize CodeMirror editors
        const editor1 = CodeMirror.fromTextArea(document.getElementById('codeEditor1'), {
            mode: 'htmlmixed',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autoCloseTags: true,
            autoCloseBrackets: true,
            extraKeys: {"Ctrl-Space": "autocomplete"}
        });
        
     
        
        // Set editor heights
        editor1.setSize(null, '100%');
    
        
        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-button');
        const exerciseTabs = document.querySelectorAll('.exercise-tab');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                exerciseTabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding tab
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Run button functionality
        document.querySelectorAll('.run-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const editor = [editor1, editor2, editor3][index];
                const outputFrame = document.querySelectorAll('.output-iframe')[index];
                const code = editor.getValue();
                
                // Flash the run button for feedback
                btn.classList.add('flash');
                setTimeout(() => btn.classList.remove('flash'), 500);
                
                // Display the output
                outputFrame.innerHTML = '';
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                outputFrame.appendChild(iframe);
                
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(code);
                iframeDoc.close();
            });
        });
        document.querySelectorAll('.lesson-link').forEach(link => {
            link.addEventListener('click', function(e) {
              e.preventDefault(); // Stop the page from jumping
          
              const module = this.getAttribute('data-module');
              const lesson = this.getAttribute('data-lesson');
          
              // Update the breadcrumb text
              document.getElementById('breadcrumb-module').textContent = module;
              document.getElementById('breadcrumb-lesson').textContent = lesson;
          
              // Optional: Highlight the clicked link
              document.querySelectorAll('.lesson-link').forEach(l => l.classList.remove('text-white', 'bg-gray-700'));
              this.classList.add('text-white', 'bg-gray-700');
            });
          });
          const subtopicsData = {
            "Introduction to HTML": [
              "What is HTML?",
              "History of HTML",
              "Why HTML is important",
              "How browsers interpret HTML"
            ],
            "HTML Document Structure": [
              "Doctype declaration",
              "HTML tag hierarchy",
              "Head vs Body",
              "Basic template setup"
            ],
            "HTML Elements & Tags": [
              "What is an element?",
              "Difference between tags and elements",
              "Block vs inline elements",
              "Common HTML tags"
            ],
            "Attributes": [
              "What are attributes?",
              "Global attributes",
              "Attribute syntax",
              "Boolean attributes"
            ],
            "Headings & Paragraphs": [
              "Using <h1> to <h6>",
              "Semantic meaning",
              "Paragraph structure",
              "Best practices for text content"
            ]
          };

          const theoryContentData = {
            "What is HTML?": `
                <h3 class="text-xl font-semibold mb-4">What is HTML?</h3>
                <p>HTML (HyperText Markup Language) is the standard language for creating web pages and web applications.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>It structures the content on the web.</li>
                        <li>Uses tags to define elements.</li>
                        <li>Works with CSS and JavaScript to build full-featured pages.</li>
                    </ul>
                </div>
            `,
            "History of HTML": `
                <h3 class="text-xl font-semibold mb-4">History of HTML</h3>
                <p>HTML was created by Tim Berners-Lee in 1991 to enable sharing and linking documents over the Internet.</p>
                <ul class="list-disc pl-5 space-y-1 mt-4">
                    <li>HTML 2.0 published in 1995</li>
                    <li>HTML5 became a standard in 2014</li>
                    <li>Continuously evolving with modern web needs</li>
                </ul>
            `,
            "Why HTML is important": `
                <h3 class="text-xl font-semibold mb-4">Why HTML is important</h3>
                <p>HTML (HyperText Markup Language) is the fundamental building block of web development. It provides the structure of web pages, allowing content to be displayed in an organized and accessible manner across different platforms and devices.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>It defines the structure of web content using various elements such as headings, paragraphs, links, and images.</li>
                        <li>HTML allows content to be formatted and styled using CSS, making it essential for design and layout.</li>
                        <li>It provides the foundation for adding interactivity and dynamic behavior with JavaScript.</li>
                        <li>HTML is accessible on all devices and is universally supported by browsers, making it the backbone of the web.</li>
                    </ul>
                </div>
                <p>Without HTML, the web would not be able to display text, images, or other media in a structured and organized manner. It is the first step in building any web page or application, and understanding its importance is crucial for any web developer.</p>
            `,
            "How browsers interpret HTML": `
                <h3 class="text-xl font-semibold mb-4">How browsers interpret HTML</h3>
                <p>Browsers interpret HTML by parsing the code and rendering it visually for users. The browser acts as a translator between the raw HTML and the displayable content.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>Browsers receive the HTML code and render the elements defined by tags, such as headings, paragraphs, and images.</li>
                        <li>HTML elements can be styled with CSS to improve visual presentation.</li>
                        <li>JavaScript can be used to add interactivity, such as responding to user input or dynamically changing the content on the page.</li>
                    </ul>
                </div>
            `,
            "Doctype declaration": `
                <h3 class="text-xl font-semibold mb-4">Doctype declaration</h3>
                <p>The doctype declaration is the first thing you see in an HTML document. It tells the browser what version of HTML the document is using, ensuring that the page is displayed correctly.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>The doctype declaration is written as <code>&lt;!DOCTYPE html&gt;</code>.</li>
                        <li>It is placed at the very beginning of an HTML document, before the <code>&lt;html&gt;</code> tag.</li>
                        <li>The doctype tells the browser to render the page in HTML5 mode, which helps avoid quirks mode (incorrect rendering behavior).</li>
                    </ul>
                </div>
            `,
            "HTML tag hierarchy": `
                <h3 class="text-xl font-semibold mb-4">HTML tag hierarchy</h3>
                <p>HTML documents are built using nested elements, with each tag serving a specific purpose. Tags are often nested within other tags, and the hierarchy determines how content is structured and displayed.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>The <code>&lt;html&gt;</code> tag is the root element of an HTML document.</li>
                        <li>Inside the <code>&lt;html&gt;</code> tag, there are two main sections: <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code>.</li>
                        <li>The <code>&lt;head&gt;</code> tag contains meta information, links to stylesheets, and other resources, while the <code>&lt;body&gt;</code> tag contains the visible content of the page.</li>
                        <li>Elements within the <code>&lt;body&gt;</code> tag are often nested in a hierarchical structure.</li>
                    </ul>
                </div>
            `,
            "Head vs Body": `
                <h3 class="text-xl font-semibold mb-4">Head vs Body</h3>
                <p>In HTML, the <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> tags serve distinct purposes, with the <code>&lt;head&gt;</code> containing meta information and the <code>&lt;body&gt;</code> holding the visible content of the page.</p>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>The <code>&lt;head&gt;</code> tag includes metadata such as the document title, character encoding, and links to external resources like stylesheets and scripts.</li>
                        <li>The <code>&lt;body&gt;</code> tag contains the main content of the page that is displayed to the user, such as text, images, and interactive elements.</li>
                        <li>Content within the <code>&lt;body&gt;</code> tag can be styled with CSS and made interactive using JavaScript.</li>
                    </ul>
                </div>
            `,
            "Basic template setup": `
                <h3 class="text-xl font-semibold mb-4">Basic template setup</h3>
                <p>Here’s a simple template structure for an HTML document that includes the essential elements such as the doctype declaration, <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, and <code>&lt;body&gt;</code> tags.</p>
                <pre class="bg-gray-700 p-4 rounded-lg text-white">
        &lt;!DOCTYPE html&gt;
        &lt;html lang="en"&gt;
          &lt;head&gt;
            &lt;meta charset="UTF-8"&gt;
            &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
            &lt;title&gt;My First HTML Page&lt;/title&gt;
          &lt;/head&gt;
          &lt;body&gt;
            &lt;h1&gt;Welcome to HTML&lt;/h1&gt;
            &lt;p&gt;This is a basic HTML document structure.&lt;/p&gt;
          &lt;/body&gt;
        &lt;/html&gt;
                </pre>
                <div class="my-6 p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
                    <h4 class="font-medium mb-2">Key Points:</h4>
                    <ul class="list-disc pl-5 space-y-1">
                        <li>The doctype declaration defines the document type and version.</li>
                        <li>The <code>&lt;html&gt;</code> tag wraps all the content.</li>
                        <li>The <code>&lt;head&gt;</code> section contains metadata and the <code>&lt;body&gt;</code> section contains the content.</li>
                    </ul>
                </div>
            `
            // Add more subtopic content as needed...
        };
        
          

          const lessonHeaderData = {
            "Introduction to HTML": {
              title: "Introduction to HTML",
              description: "Understand the basics of HTML and how it forms the foundation of web pages.",
              rating: 4.7,
              duration: "20 min",
              exercises: "2 exercises"
            },
            "HTML Document Structure": {
              title: "HTML Document Structure",
              description: "Learn how to structure your HTML documents correctly using essential tags.",
              rating: 4.5,
              duration: "25 min",
              exercises: "3 exercises"
            },
            "HTML Elements & Tags": {
              title: "HTML Elements & Tags",
              description: "Learn the building blocks of HTML documents and how to use them effectively.",
              rating: 4.5,
              duration: "25 min",
              exercises: "3 exercises"
            }
          };
          
          
        // Lesson click handler
        document.querySelectorAll(".lesson-link").forEach(link => {
            link.addEventListener("click", function (e) {
              e.preventDefault();
          
              // 🔍 Ensure we're working with the actual `.lesson-link` element
              const clickedLink = e.currentTarget;
          
              // ✅ Remove highlight from all lesson links
              document.querySelectorAll(".lesson-link").forEach(el => {
                el.classList.remove("bg-gray-700", "text-white", "font-medium");
              });
          
              // ✅ Add highlight to the clicked one
              clickedLink.classList.add("bg-gray-700", "text-white", "font-medium");
          
              // ✅ Hide and clear all subtopics
              document.querySelectorAll(".subtopics").forEach(sub => {
                sub.classList.add("hidden");
                sub.innerHTML = "";
              });
          
              const lesson = clickedLink.dataset.lesson;
              const module = clickedLink.dataset.module;
              const subtopics = subtopicsData[lesson];
          
              const subtopicsContainer = clickedLink.nextElementSibling;
              subtopicsContainer.innerHTML = "";
              subtopicsContainer.classList.remove("hidden");
          
              // ✅ Create and add subtopic links
              if (subtopics) {
                subtopics.forEach(sub => {
                  const subtopicElement = document.createElement("a");
                  subtopicElement.href = "#";
                  subtopicElement.className = "block text-sm text-gray-300 ml-4 hover:text-white subtopic-item";
                  subtopicElement.textContent = sub;
                  subtopicElement.dataset.module = module;
                  subtopicElement.dataset.lesson = lesson;
                  subtopicElement.dataset.subtopic = sub;
          
                  subtopicsContainer.appendChild(subtopicElement);
                });
                // ✅ Automatically trigger the first subtopic click
                const firstSubtopicLink = subtopicsContainer.querySelector(".subtopic-item");
                if (firstSubtopicLink) {
                    firstSubtopicLink.click();
                }
              }
          
              // ✅ Update breadcrumb (module and lesson)
              document.getElementById("breadcrumb-module").textContent = module;
              document.getElementById("breadcrumb-lesson").textContent = lesson;
          
              // ✅ Update lesson header
              const header = lessonHeaderData[lesson];
              if (header) {
                document.querySelector(".lesson-header h2").textContent = header.title;
                document.querySelector(".lesson-header p").textContent = header.description;
                document.querySelector(".lesson-rating span").textContent = header.rating;
                document.querySelector(".lesson-duration").textContent = header.duration;
                document.querySelector(".lesson-exercises").textContent = header.exercises;
              }
              // ✅ Show or hide the resource section based on the lesson
                const resourceSection = document.querySelector(".bg-gray-800.rounded-lg.shadow-lg.overflow-hidden");
                if (lesson === "Introduction to HTML") {
                resourceSection.classList.add("hidden");
                } else {
                resourceSection.classList.remove("hidden");
                }
            });
          });
          
          // Subtopic click handler
          document.addEventListener("click", function (e) {
            if (e.target.classList.contains("subtopic-item")) {
              e.preventDefault();
          
              const clickedSubtopic = e.target;
          
              // ✅ Remove highlight from all other subtopics
              document.querySelectorAll(".subtopic-item").forEach(el => {
                el.classList.remove("text-white", "font-semibold");
                el.classList.add("text-gray-300"); // reset to default
              });
          
              // ✅ Highlight the clicked subtopic
              clickedSubtopic.classList.remove("text-gray-300");
              clickedSubtopic.classList.add("text-white", "font-semibold");
          
              const module = clickedSubtopic.dataset.module;
              const lesson = clickedSubtopic.dataset.lesson;
              const subtopic = clickedSubtopic.dataset.subtopic;
          
              // ✅ Update breadcrumb with subtopic
              document.getElementById("breadcrumb-module").textContent = module;
              document.getElementById("breadcrumb-lesson").textContent = `${lesson} > ${subtopic}`;
          
              // ✅ Update lesson header
              const header = lessonHeaderData[lesson];
              if (header) {
                document.querySelector(".lesson-header h2").textContent = header.title;
                document.querySelector(".lesson-header p").textContent = header.description;
                document.querySelector(".lesson-rating span").textContent = header.rating;
                document.querySelector(".lesson-duration").textContent = header.duration;
                document.querySelector(".lesson-exercises").textContent = header.exercises;
              }
                // ✅ Inject dynamic theory content
    const theorySection = document.querySelector(".prose");
    theorySection.innerHTML = theoryContentData[subtopic] || `<h3>${subtopic}</h3><p>No content available yet.</p>`;
            }
          });
          
          
          document.getElementById("next-subtopic").addEventListener("click", function () {
            const activeSubtopic = document.querySelector(".subtopic-item.text-white.font-semibold");
            if (!activeSubtopic) return;
          
            const currentLesson = activeSubtopic.dataset.lesson;
            const subtopics = subtopicsData[currentLesson];
            const currentIndex = subtopics.indexOf(activeSubtopic.dataset.subtopic);
          
            const lessonLinks = Array.from(document.querySelectorAll(".lesson-link"));
          
            if (currentIndex < subtopics.length - 1) {
              // 👉 Go to next subtopic
              const nextSubtopicText = subtopics[currentIndex + 1];
              document.querySelectorAll(".subtopic-item").forEach(sub => {
                if (sub.dataset.lesson === currentLesson && sub.dataset.subtopic === nextSubtopicText) {
                  sub.click();
                }
              });
            } else {
              // ✅ Mark current lesson as complete
              const currentLessonLink = document.querySelector(`.lesson-link[data-lesson="${currentLesson}"]`);
              const currentIcon = currentLessonLink.querySelector("i");
          
              if (currentIcon) {
                currentIcon.className = "fas fa-check-circle text-green-400 mr-2";
              }
          
              // 👉 Move to next lesson
              const currentLessonIndex = lessonLinks.findIndex(link => link.dataset.lesson === currentLesson);
              const nextLessonLink = lessonLinks[currentLessonIndex + 1];
          
              if (nextLessonLink) {
                nextLessonLink.click();
          
                setTimeout(() => {
                  const nextLesson = nextLessonLink.dataset.lesson;
                  const nextSubtopicText = subtopicsData[nextLesson]?.[0];
          
                  if (nextSubtopicText) {
                    document.querySelectorAll(".subtopic-item").forEach(sub => {
                      if (sub.dataset.lesson === nextLesson && sub.dataset.subtopic === nextSubtopicText) {
                        sub.click();
                      }
                    });
                  }
          
                  // 🔄 Update all lesson icons and styles
                  lessonLinks.forEach((link, index) => {
                    const icon = link.querySelector("i");
                    const lessonTitle = link.dataset.lesson;
          
                    // Reset icon and text styles
                    link.classList.remove("bg-gray-700", "text-white", "font-medium");
                    link.classList.add("hover:bg-gray-700");
          
                    if (index < currentLessonIndex + 1) {
                      // ✅ Completed lessons
                      link.classList.add("text-blue-400", "font-medium");
                      icon.className = "fas fa-check-circle text-green-400 mr-2";
                    } else if (index === currentLessonIndex + 1) {
                      // ▶️ Current lesson
                      link.classList.add("bg-gray-700", "text-white", "font-medium");
                      icon.className = "fas fa-play-circle text-blue-400 mr-2";
                    } else {
                      // 🔲 Incomplete lessons
                      link.classList.add("text-gray-400");
                      icon.className = "fas fa-check-circle text-gray-500 mr-2";
                    }
                  });
          
                }, 50);
              }
            }
          });
          
          
          
          document.getElementById("previous-subtopic").addEventListener("click", function () {
            const activeSubtopic = document.querySelector(".subtopic-item.text-white.font-semibold");
            if (!activeSubtopic) return;
          
            const currentLesson = activeSubtopic.dataset.lesson;
            const subtopics = subtopicsData[currentLesson];
            const currentIndex = subtopics.indexOf(activeSubtopic.dataset.subtopic);
          
            if (currentIndex > 0) {
              // Go to previous subtopic
              const prevSubtopicText = subtopics[currentIndex - 1];
              document.querySelectorAll(".subtopic-item").forEach(sub => {
                if (sub.dataset.lesson === currentLesson && sub.dataset.subtopic === prevSubtopicText) {
                  sub.click();
                }
              });
            } else {
              // Move to previous lesson
              const lessonLinks = Array.from(document.querySelectorAll(".lesson-link"));
              const currentLessonIndex = lessonLinks.findIndex(link => link.dataset.lesson === currentLesson);
              const prevLessonLink = lessonLinks[currentLessonIndex - 1];
          
              if (prevLessonLink) {
                prevLessonLink.click();
          
                setTimeout(() => {
                  const prevLesson = prevLessonLink.dataset.lesson;
                  const prevSubtopics = subtopicsData[prevLesson];
                  const lastSubtopicText = prevSubtopics?.[prevSubtopics.length - 1];
                  if (lastSubtopicText) {
                    document.querySelectorAll(".subtopic-item").forEach(sub => {
                      if (sub.dataset.lesson === prevLesson && sub.dataset.subtopic === lastSubtopicText) {
                        sub.click();
                      }
                    });
                  }
                }, 50);
              }
            }
          });
          
          
        
       // Reset button functionality
document.querySelectorAll('.reset-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const editor = [editor1, editor2, editor3][index];
        const outputFrame = document.querySelectorAll('.output-iframe')[index];
        
        // Reset to default code
        if (index === 0) {
            editor.setValue(`<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <!-- Write your code here -->
</body>
</html>`);
        }
    });
});