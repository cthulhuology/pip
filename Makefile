all : flow.js

SCRIPTS = LICENSE Base.js Hub.js Screen.js Mouse.js Colors.js Frame.js Components.js

flow.js : $(SCRIPTS)
	cat $(SCRIPTS) > flow.js

