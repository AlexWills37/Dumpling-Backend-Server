import re
import sys

def loadXlsx(filepath):
    import pandas as pd
    df = pd.read_excel(filepath, sheet_name=None)

    # For each sheet, create a list of lines of elements in the first column.
    for sheet in df:
        lines = []
        for val in df[sheet].values.tolist():
            lines.append(val[0])
        #END

        # Write the lines to the output file.
        writeCsvOut("{}.{}.csv".format(filepath.split(".")[0], sheet), lines)
    #END
#END

def loadCsv(filepath):
    lines = []
    with open(filepath, "r") as f:
        for line in f:
            lines.append(line)
        #END
    #END
    return lines
#END

def processLine(line):
    # Replace all (72.9, 269.8, 326.7) patterns.
    x = re.findall(r"\(.*\)", line)
    for m in x:
        line = line.replace(m, m.replace(",", "\\,"))
    #END

    # Replace all non-escaped commas with a pipe.
    r = re.compile(r"(?<!\\)(?:\\\\)*,")
    line = r.sub(lambda m: m.group().replace(',', '|', 1), line)

    # Remove all escape backslashes.
    line = line.replace("\\", "")
    
    # Split line by pipe, wrap each element in quotes, and join with a comma. Also remove empty strings
    line = ",".join(['"{}"'.format(x) for x in line.split('|') if x])

    print(line)
    return line
#END

def writeCsvOut(path, lines):
    out = open(path, "w")
    for line in lines:
        line = line.replace("\n", "")
        line = line.replace(" ", "")
        line = processLine(line)
        out.write(line + "\n")
    #END
#END

# Get the commandline from args
if len(sys.argv) < 2:
    print("Usage: parseContents.py <filepath>")
    sys.exit(1)
#END

filepath = sys.argv[1]

loadXlsx(filepath)

# display any key to exit message
print("Press any key to exit.")
input()