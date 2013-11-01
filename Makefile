all : pip.js

SCRIPTS = LICENSE Base.js Message.js Screen.js Mouse.js Colors.js Frame.js Components.js

pip.js : $(SCRIPTS)
	cat $(SCRIPTS) > pip.js
	cat pip.js > ~/node_modules/provisioner/lib/pip.js

.PHONY: clean
clean:
	rm pip.js

.PHONY: dist
dist:
	git commit -a
	git push origin master
