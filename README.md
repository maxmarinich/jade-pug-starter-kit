# Jade-Pug Starter Kit

## Start of project

#### Set `gulp` global:

```bash
npm i -g gulp
```



```
npm i
```

* Open browser [`http://localhost:3000/`](http://localhost:3000/).

#### Commands

###### Deploy Gulp with `watch` option:

```
gulp
```

######  Build project:

```
gulp build
```

## The structure of folders and files 


```
├── assets/
│   │                         
│   ├── fonts/  
│   │                     
│   ├── i/                      
│   │  
│   ├── js/                      
│   │   │  
│   │   ├── vendor/              
│   │   │   └── *.js              
│   │   └── main.js               
│   │    
│   ├── sass/                    
│   │   │  
│   │   ├── etc/
│   │   ├── forms/
│   │   ├── lists/
│   │   ├── menus/
│   │   ├── sections/
│   │   ├── settings/             
│   │   │   ├── default.sass     
│   │   │   ├── fonts.sass	      
│   │   │   ├── mixin.sass	     
│   │   │   ├── optimize.sass	
│   │   │   └── variables.sass    
│   │   │  
│   │   ├── vendor/
│   │   └── common.sass           
│   │  
│   └── template/                  
│        │  
│        ├── blocks/
│        │   └── *.jade
│        │  
│        ├── etc/
│        ├── forms/
│        ├── lists/
│        ├── menus/
│        ├── sections/
│        └── index.jade            
│  
├── public/  
│   │                        
│   ├── assets/                   
│   │   ├── fonts/             
│   │   ├── img/                 
│   │   ├── js/                   
│   │   └── css/                 
│   │  
│   └── html/                      
│        ├── index.html            
│        └── another.html
│  
├── .gitignore       
├── create-block-files.js
├── gulpfile.js          
├── package.json                         
└── readme.md                  
```

## Create Block Files
##### Create blocks / files and automatically include in project dependencies
```
npm run cbf [block-name]
```

##### EXAMPLES
```
npm run cbf l-reviews

npm run cbf s-contact-a
```
