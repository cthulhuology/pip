all : pip.js

SCRIPTS = LICENSE Base.js Message.js Screen.js Mouse.js Colors.js Widget.js Console.js Frame.js Components.js Button.js Graph.js Tree.js Menu.js 

pip.js : $(SCRIPTS)
	cat $(SCRIPTS) > pip.js

.PHONY: clean
clean:
	rm pip.js

.PHONY: dist
dist:
	git commit -a
	git push origin master
