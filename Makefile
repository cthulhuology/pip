all : pip.js

<<<<<<< HEAD
SCRIPTS = LICENSE Base.js Message.js Screen.js Mouse.js Colors.js Widget.js Console.js Frame.js Components.js Button.js Graph.js Tree.js Menu.js 

pip.js : $(SCRIPTS)
	cat $(SCRIPTS) > pip.js
	cat pip.js > ~/node_modules/provisioner/lib/pip.js
=======
SCRIPTS = LICENSE Base.js Message.js Screen.js Mouse.js Colors.js Frame.js Components.js

pip.js : $(SCRIPTS)
	cat $(SCRIPTS) > pip.js
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725

.PHONY: clean
clean:
	rm pip.js
<<<<<<< HEAD

.PHONY: dist
dist:
	git commit -a
	git push origin master
=======
>>>>>>> c9eb848e68893d9e807ee6b40fa21e3682a23725
