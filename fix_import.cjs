const fs = require('fs');
let code = fs.readFileSync('src/components/SettingsView.tsx', 'utf-8');
code = code.replace("import { useEffect,", "import {");
code = code.replace("import React, { useState, useRef } from 'react';", "import React, { useState, useRef, useEffect } from 'react';");
fs.writeFileSync('src/components/SettingsView.tsx', code);
